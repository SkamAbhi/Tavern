import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Users,
  Settings,
  MessageSquare,
  User,
  Info,
  HelpCircle,
} from "lucide-react";
import io, { Socket } from "socket.io-client";
import ProtectedRoute from "./ProtectedRoutes";
import { useAuth } from "../contexts/AuthContexts";

interface Character {
  sprite: Phaser.Physics.Arcade.Sprite;
  nameTag?: Phaser.GameObjects.Text;
  isCurrentPlayer: boolean;
}

interface MeetingZone {
  zone: Phaser.GameObjects.Zone;
  id: string;
  name: string;
  capacity: number;
  currentUsers: number;
}

interface User {
  id: string;
  username: string;
  email?: string;
  currentRoom?: string;
  position?: { x: number; y: number };
}

export default function OutdoorMeeting() {
  const { user } = useAuth();
  return (
    <ProtectedRoute>
      <OutdoorMeetingContent user={user} />
    </ProtectedRoute>
  );
}

function OutdoorMeetingContent({ user }: { user?: User }) {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGame = useRef<Phaser.Game | null>(null);
  const [activeTab, setActiveTab] = useState<string>("game");
  const [userCount, setUserCount] = useState<number>(1);
  const [currentZone, setCurrentZone] = useState<string | null>(null);
  const [showControls, setShowControls] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(true);
  const [isConnected, setConnected] = useState<boolean>(false);
  const socketRef = useRef<Socket | null>(null);

  const initPhaser = async () => {
    if (typeof window === "undefined" || phaserGame.current || !gameRef.current)
      return;

    try {
      const Phaser = await import("phaser");

      class OutdoorScene extends Phaser.Scene {
        private player!: Character;
        private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
        private colliders!: Phaser.Physics.Arcade.StaticGroup;
        private players: Map<
          string,
          { character: Character; socketId: string; username: string }
        > = new Map();
        private playersGroup!: Phaser.GameObjects.Group;
        private mapWidth: number = 2000;
        private mapHeight: number = 1500;
        private hasLoggedIn: boolean = false;

        constructor() {
          super({ key: "OutdoorScene" });
        }

        preload(): void {
          this.load.image("outdoor", "/1.png");
          this.load.spritesheet("character", "/Player12.png", {
            frameWidth: 64,
            frameHeight: 64,
          });

          this.load.on("complete", () => {
            console.log("All assets loaded");
          });
          this.load.on("loaderror", (file: Phaser.Loader.File) => {
            console.error(`Error loading: ${file.key} at ${file.src}`);
          });
          this.load.on("filecomplete", (key: string) => {
            console.log(`File loaded: ${key}`);
          });
          this.load.start();
        }

        create(): void {
          if (!this.textures.exists("outdoor")) {
            console.error("Outdoor image not loaded");
            return;
          }

          this.physics.world.setBounds(0, 0, this.mapWidth, this.mapHeight);
          const outdoorMap = this.add.image(
            this.mapWidth / 2,
            this.mapHeight / 2,
            "outdoor"
          );
          outdoorMap.setDisplaySize(this.mapWidth, this.mapHeight);
          console.log("Outdoor map rendered");

          this.playersGroup = this.add.group();
          const socket = socketRef.current;

          if (socket && socket.connected && user) {
            const playerSprite = this.physics.add
              .sprite(this.mapWidth / 2, this.mapHeight * 0.8, "character", 0)
              .setScale(2);
            playerSprite.setCollideWorldBounds(true);

            this.player = {
              sprite: playerSprite,
              nameTag: this.add
                .text(playerSprite.x, playerSprite.y - 50, user.username, {
                  fontSize: "18px",
                  color: "#ffffff",
                  backgroundColor: "#000000",
                })
                .setOrigin(0.5),
              isCurrentPlayer: true,
            };

            this.playersGroup.add(this.player.sprite);
            this.playersGroup.add(this.player.nameTag);
            this.players.set(socket.id, {
              character: this.player,
              socketId: socket.id,
              username: user.username,
            });
            // Socket integration

           if (!this.hasLoggedIn) {
              socket.emit('playerLogin', { 
                userId: user.id, 
                username: user.username, 
                x: this.player.sprite.x, 
                y: this.player.sprite.y 
              });
              console.log('Emitted playerLogin:', { userId: user.id, username: user.username, x: this.player.sprite.x, y: this.player.sprite.y });
              this.hasLoggedIn = true;
            }
            socket.on('loadPlayers', (existingPlayers: { socketId: string; id: string; username: string; x: number; y: number }[]) => {
              console.log('Received loadPlayers:', existingPlayers);
              existingPlayers.forEach(({ socketId, username, x, y }) => {
                if (socketId === socket.id) return; // Skip local player

                if (!this.players.has(socketId)) {
                  const newPlayer = this.physics.add.sprite(x, y, 'character', 0).setScale(2);
                  const nameTag = this.add.text(newPlayer.x, newPlayer.y - 50, username || 'Unknown', {
                    fontSize: '18px',
                    color: '#ffffff',
                    backgroundColor: '#000000'
                  }).setOrigin(0.5);

                  this.playersGroup.add(newPlayer);
                  this.playersGroup.add(nameTag);
                  this.players.set(socketId, { character: { sprite: newPlayer, nameTag, isCurrentPlayer: false }, socketId, username });
                }
              });
              setUserCount(this.players.size);
              console.log('Players after load:', Array.from(this.players.entries()).map(([id, p]) => ({ id, username: p.username })));
            });

           // Handle new players joining
           socket.on('playerJoined', (data: { socketId: string; id: string; username: string; x: number; y: number }) => {
            const { socketId, username, x, y } = data;
            console.log('Received playerJoined:', data);
            if (socketId === socket.id) return; // Skip local player

            if (!this.players.has(socketId)) {
              const newPlayer = this.physics.add.sprite(x, y, 'character', 0).setScale(2);
              const nameTag = this.add.text(newPlayer.x, newPlayer.y - 50, username || 'Unknown', {
                fontSize: '18px',
                color: '#ffffff',
                backgroundColor: '#000000'
              }).setOrigin(0.5);

              this.playersGroup.add(newPlayer);
              this.playersGroup.add(nameTag);
              this.players.set(socketId, { character: { sprite: newPlayer, nameTag, isCurrentPlayer: false }, socketId, username });
              setUserCount(this.players.size);
              console.log('Player joined:', { socketId, username }, 'Total:', this.players.size);
            }
          });

          socket.on('playerLeft', (socketId: string) => {
            if (this.players.has(socketId)) {
              const { character } = this.players.get(socketId)!;
              character.sprite.destroy();
              character.nameTag?.destroy();
              this.players.delete(socketId);
              setUserCount(this.players.size);
              console.log('Player left:', socketId, 'Total:', this.players.size);
            }
          });

          // Handle player movement (skip local player entirely)
          socket.on('playerMoved', (data: { socketId: string; position: { x: number; y: number } }) => {
            const { socketId, position } = data;
            if (socketId === socket.id) return; // Skip local player completely

            if (this.players.has(socketId)) {
              const { character } = this.players.get(socketId)!;
              this.tweens.add({
                targets: character.sprite,
                x: position.x,
                y: position.y,
                duration: 200,
                ease: 'Linear',
                onUpdate: () => {
                  character.nameTag?.setPosition(character.sprite.x, character.sprite.y - 50);
                }
              });
            }
          });

          // Emit local player movement only when position changes
          let lastX = this.player.sprite.x;
          let lastY = this.player.sprite.y;
          this.time.addEvent({
            delay: 200,
            loop: true,
            callback: () => {
              const { x, y } = this.player.sprite;
              if (x !== lastX || y !== lastY) { // Only emit if position changed
                socket.emit('playerMove', { x, y });
                lastX = x;
                lastY = y;
              }
            },
          });
        }
          this.setupCollisions();
          this.createAnimations();
          this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);
          this.cameras.main.setZoom(0.8);
          this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
          this.cursors = this.input.keyboard.createCursorKeys();
        }

        setupCollisions(): void {
          this.colliders = this.physics.add.staticGroup();
          this.colliders.add(
            this.add.rectangle(
              this.mapWidth / 2,
              10,
              this.mapWidth,
              20,
              0xff0000,
              0
            )
          );
          this.colliders.add(
            this.add.rectangle(
              this.mapWidth / 2,
              this.mapHeight - 10,
              this.mapWidth,
              20,
              0xff0000,
              0
            )
          );
          this.colliders.add(
            this.add.rectangle(
              10,
              this.mapHeight / 2,
              20,
              this.mapHeight,
              0xff0000,
              0
            )
          );
          this.colliders.add(
            this.add.rectangle(
              this.mapWidth - 10,
              this.mapHeight / 2,
              20,
              this.mapHeight,
              0xff0000,
              0
            )
          );
          this.colliders.add(
            this.add.rectangle(
              this.mapWidth * 0.1,
              this.mapHeight * 0.1,
              200,
              150,
              0xff0000,
              0
            )
          );
          this.colliders.add(
            this.add.rectangle(
              this.mapWidth * 0.5,
              this.mapHeight * 0.9,
              300,
              150,
              0x0000ff,
              0
            )
          );
          this.colliders.add(
            this.add.circle(
              this.mapWidth * 0.8,
              this.mapHeight * 0.15,
              80,
              0x00ff00,
              0
            )
          );
          this.colliders.add(
            this.add.circle(
              this.mapWidth * 0.9,
              this.mapHeight * 0.1,
              80,
              0x00ff00,
              0
            )
          );
          this.colliders.add(
            this.add.circle(
              this.mapWidth * 0.95,
              this.mapHeight * 0.3,
              80,
              0x00ff00,
              0
            )
          );
          this.colliders.add(
            this.add.circle(
              this.mapWidth * 0.95,
              this.mapHeight * 0.5,
              80,
              0x00ff00,
              0
            )
          );
          this.colliders.add(
            this.add.circle(
              this.mapWidth * 0.05,
              this.mapHeight * 0.3,
              80,
              0x00ff00,
              0
            )
          );
          this.colliders.add(
            this.add.circle(
              this.mapWidth * 0.05,
              this.mapHeight * 0.5,
              80,
              0x00ff00,
              0
            )
          );
          this.colliders.add(
            this.add.circle(
              this.mapWidth * 0.5,
              this.mapHeight * 0.3,
              60,
              0x00ff00,
              0
            )
          );
          this.colliders.add(
            this.add.circle(
              this.mapWidth * 0.7,
              this.mapHeight * 0.6,
              60,
              0x00ff00,
              0
            )
          );
          this.colliders.add(
            this.add.circle(
              this.mapWidth * 0.3,
              this.mapHeight * 0.6,
              60,
              0x00ff00,
              0
            )
          );
          this.colliders.add(
            this.add.rectangle(
              this.mapWidth * 0.3,
              this.mapHeight * 0.2,
              400,
              20,
              0x8b4513,
              0
            )
          );
          this.colliders.add(
            this.add.rectangle(
              this.mapWidth * 0.7,
              this.mapHeight * 0.8,
              400,
              20,
              0x8b4513,
              0
            )
          );
          this.colliders.add(
            this.add.rectangle(
              this.mapWidth * 0.2,
              this.mapHeight * 0.4,
              20,
              300,
              0x8b4513,
              0
            )
          );
          this.colliders.add(
            this.add.rectangle(
              this.mapWidth * 0.8,
              this.mapHeight * 0.4,
              20,
              300,
              0x8b4513,
              0
            )
          );
          this.colliders.add(
            this.add.circle(
              this.mapWidth * 0.15,
              this.mapHeight * 0.25,
              30,
              0x8b4513,
              0
            )
          );
          this.colliders.add(
            this.add.circle(
              this.mapWidth * 0.75,
              this.mapHeight * 0.4,
              30,
              0x8b4513,
              0
            )
          );
          this.colliders.add(
            this.add.circle(
              this.mapWidth * 0.6,
              this.mapHeight * 0.7,
              30,
              0x8b4513,
              0
            )
          );
          this.physics.add.collider(this.playersGroup, this.colliders);
        }

        createAnimations(): void {
          this.anims.create({
            key: "down",
            frames: this.anims.generateFrameNumbers("character", {
              start: 0,
              end: 3,
            }),
            frameRate: 8,
            repeat: -1,
          });
          this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("character", {
              start: 4,
              end: 7,
            }),
            frameRate: 8,
            repeat: -1,
          });
          this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("character", {
              start: 8,
              end: 11,
            }),
            frameRate: 8,
            repeat: -1,
          });
          this.anims.create({
            key: "up",
            frames: this.anims.generateFrameNumbers("character", {
              start: 12,
              end: 15,
            }),
            frameRate: 8,
            repeat: -1,
          });
          this.anims.create({
            key: "idle-down",
            frames: [{ key: "character", frame: 0 }],
            frameRate: 1,
          });
          this.anims.create({
            key: "idle-left",
            frames: [{ key: "character", frame: 4 }],
            frameRate: 1,
          });
          this.anims.create({
            key: "idle-right",
            frames: [{ key: "character", frame: 8 }],
            frameRate: 1,
          });
          this.anims.create({
            key: "idle-up",
            frames: [{ key: "character", frame: 12 }],
            frameRate: 1,
          });
          this.player.sprite.anims.play("idle-down");
        }

        update(): void {
          const speed = 250;
          let lastDirection = "down";
          if (this.player.sprite.anims.currentAnim) {
            const currentAnim = this.player.sprite.anims.currentAnim.key;
            if (currentAnim === "up" || currentAnim === "idle-up")
              lastDirection = "up";
            else if (currentAnim === "down" || currentAnim === "idle-down")
              lastDirection = "down";
            else if (currentAnim === "left" || currentAnim === "idle-left")
              lastDirection = "left";
            else if (currentAnim === "right" || currentAnim === "idle-right")
              lastDirection = "right";
          }

          this.player.nameTag?.setPosition(
            this.player.sprite.x,
            this.player.sprite.y - 50
          );
          this.player.sprite.setVelocity(0);
          let isMoving = false;

          if (this.cursors.left.isDown) {
            this.player.sprite.setVelocityX(-speed);
            this.player.sprite.anims.play("left", true);
            lastDirection = "left";
            isMoving = true;
          } else if (this.cursors.right.isDown) {
            this.player.sprite.setVelocityX(speed);
            this.player.sprite.anims.play("right", true);
            lastDirection = "right";
            isMoving = true;
          }

          if (this.cursors.up.isDown) {
            this.player.sprite.setVelocityY(-speed);
            if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
              this.player.sprite.anims.play("up", true);
              lastDirection = "up";
            }
            isMoving = true;
          } else if (this.cursors.down.isDown) {
            this.player.sprite.setVelocityY(speed);
            if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
              this.player.sprite.anims.play("down", true);
              lastDirection = "down";
            }
            isMoving = true;
          }

          if (!isMoving) {
            this.player.sprite.anims.play(`idle-${lastDirection}`, true);
          }
        }
      }

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        parent: gameRef.current,
        pixelArt: true,
        backgroundColor: "#4ade80",
        physics: {
          default: "arcade",
          arcade: { gravity: { y: 0, x: 0 }, debug: false },
        },
        scene: [OutdoorScene],
      };

      phaserGame.current = new Phaser.Game(config);

      const resizeGame = () => {
        if (phaserGame.current) {
          phaserGame.current.scale.resize(
            window.innerWidth,
            window.innerHeight
          );
        }
      };

      window.addEventListener("resize", resizeGame);

      return () => {
        window.removeEventListener("resize", resizeGame);
        if (phaserGame.current) {
          phaserGame.current.destroy(true);
          phaserGame.current = null;
        }
      };
    } catch (error) {
      console.error("Failed to initialize Phaser:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const socket = io("http://localhost:4000", {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      auth: {
        token: token,
      },
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to server with ID:", socket.id);
      setConnected(true);
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      setConnected(false);

      if (phaserGame.current) {
        phaserGame.current.destroy(true);
        phaserGame.current = null;
      }
      
    });
    socket.on("connect_error", (err: { message: any; }) => {
      console.error("Connection error:", err.message);
    });
    socket.on("reconnect_attempt", (attempt: any) => {
      console.log("Reconnection attempt:", attempt);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && activeTab === "game" && isConnected && user) {
      setTimeout(() => initPhaser(), 50);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullScreen(false);
        setActiveTab('chat');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTab, isConnected, user]);

  return (
    <div className="min-h-screen bg-green-900 text-white">
      <Head>
        <title>Outdoor Meeting Space</title>
        <meta
          name="description"
          content="Virtual outdoor area for meetings and gatherings"
        />
      </Head>

      {isFullScreen && activeTab === "game" ? (
        <div className="fixed inset-0 w-screen h-screen">
          <div ref={gameRef} className="w-full h-full"></div>
          <div className="fixed top-4 right-4 flex gap-2 z-10">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowControls(!showControls)}
                  >
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Show Controls</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setIsFullScreen(false);
                      setActiveTab("chat");
                    }}
                  >
                    <Info className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Exit Fullscreen (ESC)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {showControls && (
            <Card className="fixed top-16 right-4 z-10 w-64 bg-green-800/90">
              <CardHeader className="py-2">
                <CardTitle className="text-sm">Controls</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <p className="text-xs mb-2">Move: Arrow Keys</p>
                <p className="text-xs mb-2">Interact: Space</p>
                <p className="text-xs mb-2">
                  Join Meeting: Enter key when in a meeting zone
                </p>
                <p className="text-xs">Exit Fullscreen: ESC key</p>
              </CardContent>
            </Card>
          )}
          {currentZone && (
            <Card className="fixed bottom-4 left-4 z-10 w-64 bg-green-800/90">
              <CardHeader className="py-2">
                <CardTitle className="text-sm">
                  {currentZone === "cabin" && "Cabin"}
                  {currentZone === "pond" && "Pond"}
                  {currentZone === "campfire" && "Campfire"}
                  {currentZone === "log-circle" && "Log Circle"}
                  {currentZone === "forest-edge" && "Forest Edge"}
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <p className="text-xs">
                  Press Enter to join the meeting in this area
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <div className="container mx-auto p-4">
          <header className="flex justify-between items-center mb-6 pb-4 border-b border-green-700">
            <h1 className="text-3xl font-medium text-green-200">
              Outdoor Meeting Grounds
            </h1>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Users className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Online Users: {userCount}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Avatar>
                <AvatarImage src="/avatars/user.png" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </header>

          <main className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 lg:mx-auto">
              <Tabs
                defaultValue="game"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="mb-4">
                  <TabsTrigger value="game">Outdoor Area</TabsTrigger>
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                  <TabsTrigger value="info">Info</TabsTrigger>
                </TabsList>
                <TabsContent
                  value="game"
                  className="relative mx-auto max-w-4xl"
                >
                  <div className="flex justify-end mb-4">
                    <Button onClick={() => setIsFullScreen(true)}>
                      Enter Fullscreen Mode
                    </Button>
                  </div>
                  <div
                    ref={gameRef}
                    className="h-[600px] rounded-lg overflow-hidden border-4 border-green-900/70 shadow-lg"
                  ></div>
                </TabsContent>
                <TabsContent value="chat">
                  <Card>
                    <CardHeader>
                      <CardTitle>Outdoor Chat</CardTitle>
                      <CardDescription>
                        Talk with other visitors
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[500px] overflow-y-auto border border-green-700 rounded-md p-4">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>R</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">Ranger</p>
                            <p className="text-sm text-gray-400">
                              Welcome to the Outdoor Meeting Grounds! Find a
                              spot to gather with friends.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="w-full flex gap-2">
                        <input
                          type="text"
                          placeholder="Type a message..."
                          className="flex-1 rounded-md bg-green-800 border border-green-700 p-2 text-sm"
                        />
                        <Button>Send</Button>
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="info">
                  <Card>
                    <CardHeader>
                      <CardTitle>Area Information</CardTitle>
                      <CardDescription>
                        About this meeting space
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium text-green-200">
                            Meeting Areas
                          </h3>
                          <ul className="mt-2 space-y-2">
                            <li className="flex items-center gap-2">
                              <Badge variant="outline">Cabin</Badge>
                              <span className="text-sm">
                                Private indoor meetings (4 people)
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Badge variant="outline">Pond</Badge>
                              <span className="text-sm">
                                Scenic water's edge discussions (6 people)
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Badge variant="outline">Campfire</Badge>
                              <span className="text-sm">
                                Casual gatherings (6 people)
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Badge variant="outline">Log Circle</Badge>
                              <span className="text-sm">
                                Group discussions (8 people)
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Badge variant="outline">Forest Edge</Badge>
                              <span className="text-sm">
                                Quiet reflection (4 people)
                              </span>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-green-200">
                            How to use
                          </h3>
                          <p className="mt-2 text-sm">
                            Move your character to any meeting area and press
                            Enter to join that area's meeting. You can chat
                            privately with others in the same meeting area.
                          </p>
                          <p className="mt-2 text-sm">
                            For the best experience, use the fullscreen mode
                            available in the Outdoor Area tab.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
