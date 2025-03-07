// pages/tavern.tsx
import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Users, Settings, MessageSquare, User, Info, HelpCircle } from "lucide-react";
import type { Game, Scene, Types } from 'phaser';

// Define types for character properties
interface Character {
  sprite: Phaser.Physics.Arcade.Sprite;
  nameTag?: Phaser.GameObjects.Text;
  isCurrentPlayer: boolean;
}

// Define types for meeting zones
interface MeetingZone {
  zone: Phaser.GameObjects.Zone;
  id: string;
  name: string;
  capacity: number;
  currentUsers: number;
}

export default function Tavern() {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGame = useRef<Game | null>(null);
  const [activeTab, setActiveTab] = useState<string>("game");
  const [userCount, setUserCount] = useState<number>(1);
  const [currentZone, setCurrentZone] = useState<string | null>(null);
  const [showControls, setShowControls] = useState<boolean>(false);

  // useEffect(() => {
  //   // Only initialize Phaser when on the game tab and in browser environment
  //   if (activeTab === "game" && typeof window !== 'undefined') {
  //     initPhaser();
  //   } else if (phaserGame.current) {
  //     phaserGame.current.destroy(true);
  //     phaserGame.current = null;
  //   }
    
  //   return () => {
  //     if (phaserGame.current) {
  //       phaserGame.current.destroy(true);
  //       phaserGame.current = null;
  //     }
  //   };
  // }, [activeTab]);

  // // Handle window resize
  // useEffect(() => {
  //   const handleResize = () => {
  //     if (phaserGame.current && gameRef.current) {
  //       phaserGame.current.scale.resize(
  //         gameRef.current.clientWidth,
  //         gameRef.current.clientHeight
  //       );
  //     }
  //   };

  //   window.addEventListener('resize', handleResize);
  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);
  // const initPhaser = async () => {
  //   if (typeof window === 'undefined' || phaserGame.current || !gameRef.current) return;
  
  //   try {
  //     const Phaser = await import('phaser');
      
  //     class TavernScene extends Phaser.Scene {
  //       private player!: Character;
  //       private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  //       private meetingZones: MeetingZone[] = [];
  //       private colliders!: Phaser.Physics.Arcade.StaticGroup;
  //       private zoneTexts: Phaser.GameObjects.Text[] = [];
        
  //       constructor() {
  //         super({ key: 'TavernScene' });
  //       }
        
  //       preload(): void {
  //         this.load.image('tavern', './Tavern.jpeg');
  //         this.load.spritesheet('character', 
  //           'Player12.png',
  //           { frameWidth: 32, frameHeight: 32 }
  //         );
  //       }
        
  //       create(): void {
  //         // Add tavern map as background
  //         this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'tavern')
  //         .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

  //         // Scale map to fit
         
          
          
  //         // Create player sprite - position it at the entrance
  //         const playerSprite = this.physics.add.sprite(
  //           this.cameras.main.width / 2, 
  //           this.cameras.main.height * 0.8, 
  //           'character', 
  //           0
  //         );
  //         playerSprite.setScale(2); // Scale up the character
          
  //         this.player = {
  //           sprite: playerSprite,
  //           nameTag: this.add.text(
  //             playerSprite.x, 
  //             playerSprite.y - 40, 
  //             'You', 
  //             { fontSize: '16px', color: '#ffffff', backgroundColor: '#000000' }
  //           ).setOrigin(0.5),
  //           isCurrentPlayer: true
  //         };
          
        
          
  //         // Create animations
  //         this.createAnimations();
          
  //         // Set up cursor keys for input
  //         this.cursors = this.input.keyboard.createCursorKeys();
          
  //         // Set camera to follow player
  //         this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);
  //         this.cameras.main.setZoom(1);
          
  //         // Event listener for zone entry/exit
  //         this.physics.add.overlap(
  //           this.player.sprite, 
  //           this.meetingZones.map(zone => zone.zone), 
  //           this.handleZoneOverlap, 
  //           undefined, 
  //           this
  //         );
  //       }
        
  //       setupCollisions(scale: number, map: Phaser.GameObjects.Image): void {
  //         this.colliders = this.physics.add.staticGroup();
          
  //         // Wall boundaries
  //         const mapWidth = map.displayWidth;
  //         const mapHeight = map.displayHeight;
  //         const centerX = this.cameras.main.width / 2;
  //         const centerY = this.cameras.main.height / 2;
          
  //         // Add invisible walls around the tavern
  //         this.colliders.add(this.add.rectangle(centerX, centerY - mapHeight/2 + 20, mapWidth, 40, 0xFF0000, 0)); // Top
  //         this.colliders.add(this.add.rectangle(centerX, centerY + mapHeight/2 - 20, mapWidth, 40, 0xFF0000, 0)); // Bottom
  //         this.colliders.add(this.add.rectangle(centerX - mapWidth/2 + 20, centerY, 40, mapHeight, 0xFF0000, 0)); // Left
  //         this.colliders.add(this.add.rectangle(centerX + mapWidth/2 - 20, centerY, 40, mapHeight, 0xFF0000, 0)); // Right
          
  //         // Tables and furniture (adjust coordinates based on scaled map)
  //         // Top left room
  //         this.colliders.add(this.add.circle(centerX - mapWidth*0.3, centerY - mapHeight*0.3, 40 * scale, 0xFF0000, 0)); // Table
          
  //         // Top right room
  //         this.colliders.add(this.add.circle(centerX + mapWidth*0.3, centerY - mapHeight*0.3, 40 * scale, 0xFF0000, 0)); // Table
          
  //         // Central fireplace
  //         this.colliders.add(this.add.rectangle(centerX, centerY - mapHeight*0.3, 100 * scale, 60 * scale, 0xFF0000, 0));
          
  //         // Bottom tables
  //         this.colliders.add(this.add.rectangle(centerX - mapWidth*0.25, centerY + mapHeight*0.25, 120 * scale, 40 * scale, 0xFF0000, 0));
  //         this.colliders.add(this.add.rectangle(centerX + mapWidth*0.25, centerY + mapHeight*0.25, 120 * scale, 40 * scale, 0xFF0000, 0));
  //         this.colliders.add(this.add.circle(centerX + mapWidth*0.3, centerY + mapHeight*0.05, 50 * scale, 0xFF0000, 0)); // Round table
          
  //         // Bar counter
  //         this.colliders.add(this.add.rectangle(centerX, centerY + mapHeight*0.1, 100 * scale, 40 * scale, 0xFF0000, 0));
          
  //         // Add collision between player and colliders
  //         this.physics.add.collider(this.player.sprite, this.colliders);
  //       }
        
  //       setupMeetingZones(scale: number, map: Phaser.GameObjects.Image): void {
  //         const mapWidth = map.displayWidth;
  //         const mapHeight = map.displayHeight;
  //         const centerX = this.cameras.main.width / 2;
  //         const centerY = this.cameras.main.height / 2;
          
  //         // Define key meeting areas
  //         const meetingAreas = [
  //           {
  //             id: 'top-left-room',
  //             name: 'Guild Room',
  //             x: centerX - mapWidth*0.3,
  //             y: centerY - mapHeight*0.3,
  //             width: 150 * scale,
  //             height: 150 * scale,
  //             capacity: 4
  //           },
  //           {
  //             id: 'top-right-room',
  //             name: 'Familiar Room',
  //             x: centerX + mapWidth*0.3,
  //             y: centerY - mapHeight*0.3,
  //             width: 150 * scale,
  //             height: 150 * scale,
  //             capacity: 4
  //           },
  //           {
  //             id: 'fireplace',
  //             name: 'Hearth',
  //             x: centerX,
  //             y: centerY - mapHeight*0.25,
  //             width: 120 * scale,
  //             height: 100 * scale,
  //             capacity: 6
  //           },
  //           {
  //             id: 'round-table',
  //             name: 'Grand Table',
  //             x: centerX + mapWidth*0.3,
  //             y: centerY + mapHeight*0.05,
  //             width: 120 * scale,
  //             height: 120 * scale,
  //             capacity: 8
  //           },
  //           {
  //             id: 'bar',
  //             name: 'Bar Counter',
  //             x: centerX,
  //             y: centerY + mapHeight*0.1,
  //             width: 150 * scale,
  //             height: 80 * scale,
  //             capacity: 4
  //           }
  //         ];
          
  //         // Create meeting zones
  //         meetingAreas.forEach(area => {
  //           const zone = this.add.zone(area.x, area.y, area.width, area.height);
  //           this.physics.world.enable(zone, Phaser.Physics.Arcade.STATIC_BODY);
            
  //           // Create zone display when debugging
  //           if (process.env.NODE_ENV === 'development') {
  //             const rect = this.add.rectangle(area.x, area.y, area.width, area.height, 0x00ff00, 0.2);
  //             const text = this.add.text(area.x, area.y - area.height/2 - 20, area.name, { 
  //               fontSize: '16px', 
  //               color: '#ffffff',
  //               backgroundColor: '#333333',
  //               padding: { x: 5, y: 2 }
  //             }).setOrigin(0.5);
  //             this.zoneTexts.push(text);
  //           }
            
  //           this.meetingZones.push({
  //             zone,
  //             id: area.id,
  //             name: area.name,
  //             capacity: area.capacity,
  //             currentUsers: Math.floor(Math.random() * 3) // Simulate some users
  //           });
  //         });
  //       }
        
  //       createAnimations(): void {
  //         this.anims.create({
  //           key: 'down',
  //           frames: this.anims.generateFrameNumbers('character', { start: 0, end: 3 }),
  //           frameRate: 10,
  //           repeat: -1
  //         });
          
  //         this.anims.create({
  //           key: 'left',
  //           frames: this.anims.generateFrameNumbers('character', { start: 4, end: 7 }),
  //           frameRate: 10,
  //           repeat: -1
  //         });
          
  //         this.anims.create({
  //           key: 'right',
  //           frames: this.anims.generateFrameNumbers('character', { start: 8, end: 11 }),
  //           frameRate: 10,
  //           repeat: -1
  //         });
          
  //         this.anims.create({
  //           key: 'up',
  //           frames: this.anims.generateFrameNumbers('character', { start: 12, end: 15 }),
  //           frameRate: 10,
  //           repeat: -1
  //         });
  //       }
        
  //       handleZoneOverlap(player: Phaser.GameObjects.GameObject, zoneObject: Phaser.GameObjects.GameObject): void {
  //         const zone = this.meetingZones.find(
  //           z => z.zone === zoneObject
  //         );
          
  //         if (zone && currentZone !== zone.id) {
  //           // Enter new zone
  //           setCurrentZone(zone.id);
  //         }
  //       }
        
  //       update(): void {
  //         const speed = 150;
          
  //         // Update name tag position
  //         if (this.player.nameTag) {
  //           this.player.nameTag.setPosition(this.player.sprite.x, this.player.sprite.y - 40);
  //         }
          
  //         // Reset velocity
  //         this.player.sprite.setVelocity(0);
          
  //         // Handle movement based on keyboard input
  //         if (this.cursors.left.isDown) {
  //           this.player.sprite.setVelocityX(-speed);
  //           this.player.sprite.anims.play('left', true);
  //         } else if (this.cursors.right.isDown) {
  //           this.player.sprite.setVelocityX(speed);
  //           this.player.sprite.anims.play('right', true);
  //         }
          
  //         if (this.cursors.up.isDown) {
  //           this.player.sprite.setVelocityY(-speed);
  //           if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
  //             this.player.sprite.anims.play('up', true);
  //           }
  //         } else if (this.cursors.down.isDown) {
  //           this.player.sprite.setVelocityY(speed);
  //           if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
  //             this.player.sprite.anims.play('down', true);
  //           }
  //         }
          
  //         // Stop animation when player is not moving
  //         if (this.player.sprite.body.velocity.x === 0 && this.player.sprite.body.velocity.y === 0) {
  //           this.player.sprite.anims.stop();
  //         }
          
  //         // Update zone check
  //         let isInAnyZone = false;
  //         for (const zone of this.meetingZones) {
  //           const zoneBody = zone.zone.body as Phaser.Physics.Arcade.Body;
  //           if (zoneBody.touching.none) {
  //             if (zone.id === currentZone) {
  //               // Exit zone
  //               setCurrentZone(null);
  //             }
  //           } else {
  //             isInAnyZone = true;
  //           }
  //         }
          
  //         if (!isInAnyZone && currentZone) {
  //           setCurrentZone(null);
  //         }
  //       }
  //     }
      
  //     const config: Types.Core.GameConfig = {
  //       type: Phaser.AUTO,
  //       width: gameRef.current.clientWidth,
  //       height: gameRef.current.clientHeight,
  //       parent: gameRef.current,
  //       pixelArt: true,
  //       backgroundColor: '#1a1c2c',
  //       physics: {
  //         default: 'arcade',
  //         arcade: {
  //           gravity: {
  //             y: 0,
  //             x: 0
  //           },
  //           debug: process.env.NODE_ENV === 'development'
  //         }
  //       },
  //       scene: [TavernScene]
  //     };

  //     phaserGame.current = new Phaser.Game(config);
      
  //   } catch (error) {
  //     console.error("Failed to initialize Phaser:", error);
  //   }
  // };
  const initPhaser = async () => {
    if (typeof window === 'undefined' || phaserGame.current || !gameRef.current) return;
  
    try {
      const Phaser = await import('phaser');
  
      class TavernScene extends Phaser.Scene {
        private player!: Character;
        private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
        private colliders!: Phaser.Physics.Arcade.StaticGroup;
  
        constructor() {
          super({ key: 'TavernScene' });
        }
  
        preload(): void {
          this.load.image('tavern', './Tavern.jpeg');
          this.load.spritesheet('character', 'Player12.png', {
            frameWidth: 32,
            frameHeight: 32
          });
        }
  
        create(): void {
          // Add tavern map as background
          const tavernMap = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'tavern');
          tavernMap.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
  
          // Create player sprite - positioned at the entrance
          const playerSprite = this.physics.add.sprite(
            this.cameras.main.width / 2,
            this.cameras.main.height * 0.8,
            'character',
            0
          ).setScale(1.5); // Adjust sprite size
  
          playerSprite.setCollideWorldBounds(true); // 🔹 Player can't leave the game world
  
          this.player = {
            sprite: playerSprite,
            nameTag: this.add.text(playerSprite.x, playerSprite.y - 40, 'You', {
              fontSize: '16px',
              color: '#ffffff',
              backgroundColor: '#000000'
            }).setOrigin(0.5),
            isCurrentPlayer: true
          };
  
          // Add physics-based world boundaries
          this.physics.world.setBounds(20, 20, this.cameras.main.width - 40, this.cameras.main.height - 40);
  
          // Create collisions
          this.setupCollisions();
  
          // Create animations
          this.createAnimations();
  
          // Set up cursor keys for input
          this.cursors = this.input.keyboard.createCursorKeys();
  
          // Set camera to follow player
          this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);
          this.cameras.main.setZoom(1);
        }
  
        setupCollisions(): void {
          this.colliders = this.physics.add.staticGroup();
  
          // Define boundaries using invisible walls
          const worldWidth = this.cameras.main.width;
          const worldHeight = this.cameras.main.height;
  
          this.colliders.add(this.add.rectangle(worldWidth / 2, 10, worldWidth, 20, 0xff0000, 0)); // Top wall
          this.colliders.add(this.add.rectangle(worldWidth / 2, worldHeight - 10, worldWidth, 20, 0xff0000, 0)); // Bottom wall
          this.colliders.add(this.add.rectangle(10, worldHeight / 2, 20, worldHeight, 0xff0000, 0)); // Left wall
          this.colliders.add(this.add.rectangle(worldWidth - 10, worldHeight / 2, 20, worldHeight, 0xff0000, 0)); // Right wall
  
          // Add collisions between player and walls
          this.physics.add.collider(this.player.sprite, this.colliders);
        }
  
        createAnimations(): void {
          this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('character', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
          });
  
          this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('character', { start: 4, end: 7 }),
            frameRate: 10,
            repeat: -1
          });
  
          this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('character', { start: 8, end: 11 }),
            frameRate: 10,
            repeat: -1
          });
  
          this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('character', { start: 12, end: 15 }),
            frameRate: 10,
            repeat: -1
          });
        }
  
        update(): void {
          const speed = 150;
  
          // Update name tag position
          if (this.player.nameTag) {
            this.player.nameTag.setPosition(this.player.sprite.x, this.player.sprite.y - 40);
          }
  
          // Reset velocity
          this.player.sprite.setVelocity(0);
  
          // Handle movement
          if (this.cursors.left.isDown) {
            this.player.sprite.setVelocityX(-speed);
            this.player.sprite.anims.play('left', true);
          } else if (this.cursors.right.isDown) {
            this.player.sprite.setVelocityX(speed);
            this.player.sprite.anims.play('right', true);
          }
  
          if (this.cursors.up.isDown) {
            this.player.sprite.setVelocityY(-speed);
            if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
              this.player.sprite.anims.play('up', true);
            }
          } else if (this.cursors.down.isDown) {
            this.player.sprite.setVelocityY(speed);
            if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
              this.player.sprite.anims.play('down', true);
            }
          }
  
          // Stop animation when not moving
          if (this.player.sprite.body.velocity.x === 0 && this.player.sprite.body.velocity.y === 0) {
            this.player.sprite.anims.stop();
          }
        }
      }
  
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: gameRef.current.clientWidth,
        height: gameRef.current.clientHeight,
        parent: gameRef.current,
        pixelArt: true,
        backgroundColor: '#1a1c2c',
        physics: {
          default: 'arcade',
          arcade: {
            gravity: {
              y: 0,
              x: 0
            },
            debug: false
          }
        },
        scene: [TavernScene]
      };
  
      phaserGame.current = new Phaser.Game(config);
    } catch (error) {
      console.error("Failed to initialize Phaser:", error);
    }
  };
  
  
  useEffect(() => {
    if (typeof window !== 'undefined' && activeTab === "game") {
      setTimeout(() => initPhaser(), 50); // Small delay to ensure the DOM is ready
    }
  }, [activeTab]);
  

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Medieval Tavern Meeting Space</title>
        <meta name="description" content="Virtual medieval tavern for meetings and gatherings" />
      </Head>

      <div className="container mx-auto p-4">
        <header className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
          <h1 className="text-3xl font-medieval text-amber-200">The Isekai Tavern</h1>
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
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => setShowControls(!showControls)}>
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Show Controls</p>
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
          <div className="lg:col-span-3">
            <Tabs defaultValue="game" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="game">Tavern</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="info">Info</TabsTrigger>
              </TabsList>
              
              <TabsContent value="game" className="relative">
                {showControls && (
                  <Card className="absolute top-2 left-2 z-10 w-64 bg-gray-800/90">
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm">Controls</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <p className="text-xs mb-2">Move: Arrow Keys</p>
                      <p className="text-xs mb-2">Interact: Space</p>
                      <p className="text-xs">Join Meeting: Enter key when in a meeting zone</p>
                    </CardContent>
                  </Card>
                )}
                
                {currentZone && (
                  <Card className="absolute bottom-2 left-2 z-10 w-64 bg-gray-800/90">
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm">
                        {currentZone === 'top-left-room' && 'Guild Room'}
                        {currentZone === 'top-right-room' && 'Familiar Room'}
                        {currentZone === 'fireplace' && 'Hearth'}
                        {currentZone === 'round-table' && 'Grand Table'}
                        {currentZone === 'bar' && 'Bar Counter'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <p className="text-xs">Press Enter to join the meeting in this area</p>
                    </CardContent>
                  </Card>
                )}
                
                <div 
                  ref={gameRef} 
                  className="h-[600px] rounded-lg overflow-hidden border-4 border-amber-900/70 shadow-lg"
                ></div>
              </TabsContent>
              
              <TabsContent value="chat">
                <Card>
                  <CardHeader>
                    <CardTitle>Tavern Chat</CardTitle>
                    <CardDescription>Talk with other adventurers</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[500px] overflow-y-auto border border-gray-700 rounded-md p-4">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>T</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">Tavern Keeper</p>
                          <p className="text-sm text-gray-400">Welcome to the Isekai Tavern! Find a comfortable spot for your meeting.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="w-full flex gap-2">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 rounded-md bg-gray-800 border border-gray-700 p-2 text-sm"
                      />
                      <Button>Send</Button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="info">
                <Card>
                  <CardHeader>
                    <CardTitle>Tavern Information</CardTitle>
                    <CardDescription>About this meeting space</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium text-amber-200">Meeting Areas</h3>
                        <ul className="mt-2 space-y-2">
                          <li className="flex items-center gap-2">
                            <Badge variant="outline">Guild Room</Badge>
                            <span className="text-sm">Small private meetings (4 people)</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Badge variant="outline">Familiar Room</Badge>
                            <span className="text-sm">Small private meetings (4 people)</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Badge variant="outline">Hearth</Badge>
                            <span className="text-sm">Casual gatherings (6 people)</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Badge variant="outline">Grand Table</Badge>
                            <span className="text-sm">Large meetings (8 people)</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Badge variant="outline">Bar Counter</Badge>
                            <span className="text-sm">Quick discussions (4 people)</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-amber-200">How to use</h3>
                        <p className="mt-2 text-sm">Move your character to any meeting area and press Enter to join that area's meeting. You can chat privately with others in the same meeting area.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Currently Online</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/avatars/user.png" />
                        <AvatarFallback>Y</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">You</p>
                        <p className="text-xs text-gray-400">
                          {currentZone ? 
                            currentZone === 'top-left-room' ? 'In Guild Room' : 
                            currentZone === 'top-right-room' ? 'In Familiar Room' : 
                            currentZone === 'fireplace' ? 'At the Hearth' : 
                            currentZone === 'round-table' ? 'At Grand Table' : 
                            'At Bar Counter' 
                          : 'Exploring'}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-900/30">Online</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>T</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">Tavern Keeper</p>
                        <p className="text-xs text-gray-400">At Bar Counter</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-900/30">NPC</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Start Private Chat
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}