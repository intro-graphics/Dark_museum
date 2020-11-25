import {defs, tiny} from './examples/common.js';
import {Shape_From_File} from './examples/obj-file-demo.js';
// Pull these names into this module's scope for convenience:
const {vec3, vec4, Vector, color, hex_color, Mat4, Light, Shape, Material, Shader, Texture, Scene} = tiny;
const {Triangle, Square, Tetrahedron, Torus, Windmill, Cube, Subdivision_Sphere, Cylindrical_Tube, Textured_Phong, Phong_Shader} = defs;

// For writing game text
import {Text_Line} from './text-line.js';

export class DarkHouse_Base extends Scene {

    // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
    constructor() {
        super();

        this.startGame = false;
        this.pauseGame = false;
        this.endGame = false;
        this.allObjectsFound = false;

        // For keep tracking of current time in game
        this.timeUpdated = false;
        this.currentGameTime = 60;

        // For tracking victory
        this.victory = false;

        // Models
        this.shapes = {
            wall: new Square(),
            cube: new Cube(),
            torus: new defs.Torus(3, 15),
            object1: new defs.Subdivision_Sphere(4),
            object2: new defs.Subdivision_Sphere(2),
            cow: new Shape_From_File("assets/spot_triangulated.obj"),
            text: new Text_Line(35)
        };

        // TODO: set better wall material
        this.materials = {
            wall_material: new Material(new defs.Phong_Shader(),
                { ambient: .4, diffusivity: .6, color: hex_color("#ffffff") }),
            
            texture_wall: new Material(new Textured_Phong(), {
                color: hex_color("#ffffff"),
                ambient: .5, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/brick-wall.jpg")
            }),

            texture_box: new Material(new Textured_Phong(), {
                color: hex_color("#ffffff"),
                ambient: .5, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/rubiks-cube.png")
            }),

            texture_sphere: new Material(new Textured_Phong(), {
                color: hex_color("#ffffff"),
                ambient: .3, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/earth.gif")
            }),

            texture_minecraft: new Material(new Textured_Phong(), {
                color: hex_color("#ffffff"),
                ambient: .3, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/minecraft.jpg")
            }),

            texture_woodbox: new Material(new Textured_Phong(), {
                color: hex_color("#ffffff"),
                ambient: .3, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/woodbox.jpg")
            }),

            texture_UFO: new Material(new Textured_Phong(), {
                color: hex_color("#ffffff"),
                ambient: .3, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/UFO.jpg")
            }),

            sphere_material: new Material(new defs.Phong_Shader(), {ambient: 1, diffusivity: 1, specularity: 0.5, color: hex_color("#252F2F")}),
            
            cube_material:  new Material(new defs.Phong_Shader(), {ambient: 1, diffusivity: 1, specularity: 0.5, color: hex_color("#0398FC")}),
            
            torus_material: new Material(new defs.Phong_Shader(), {ambient: 1, diffusivity: 1, specularity: 0.5, color: hex_color("#FCBA03")}),
            
            cow_material: new Material(new defs.Fake_Bump_Map(1), {
                color: color(.5, .5, .5, 1),
                ambient: 0.5, diffusivity: 1, specularity: 1, texture: new Texture("assets/spot_texture.png")
            }),

            start_background: new Material(new Phong_Shader(), {
                color: color(0.5, 0.5, 0.5, 1), ambient: 0,
                diffusivity: 0, specularity: 0, smoothness: 20
            }),

            // To show text you need a Material like this one:
            text_image: new Material(new Textured_Phong(1), {
                ambient: 1, diffusivity: 0, specularity: 0,
                texture: new Texture("assets/text.png")
            })

        };

        // Level height for the camera
        this.initial_camera_location = Mat4.look_at(vec3(-10, 3, 0), vec3(0, 3, 0), vec3(0, 1, 0)).times(Mat4.rotation(- Math.PI/2, 1, 0, 0));
    }

    // Setup Game Controls
    make_control_panel() {
        this.control_panel.innerHTML += "DarkHouse Game Controls: ";
        this.new_line(); this.new_line();

        // Start Game
        this.key_triggered_button("Start Game", ["Control", "s"], () => {
            this.startGame = true;
        });
        this.new_line(); this.new_line();

        // Pause Game
        this.key_triggered_button("Pause Game", ["Control", "p"], () => {
            // Only toggle once game has started and game has not ended
            if (this.startGame && !this.endGame) {
                this.pauseGame = !this.pauseGame;
            }
        });
        this.new_line(); this.new_line();

        // Restart Game
        this.key_triggered_button("Restart Game", ["Control", "r"], () => {
            // Only toggle once game has started and game has not ended
            this.startGame = false;
            this.pauseGame = false;
            this.endGame = false;
            this.allObjectsFound = false;
            this.timeUpdated = false;
            this.currentGameTime = 60;
            this.victory = false;
        });
        this.new_line(); this.new_line();

        // Add buttons so the user can actively toggle camera positions
        this.key_triggered_button("Return To Initial Position", ["Control", "o"], () => this.attached = () => this.initial_camera_location);
    }

    attach_light_to_camera(program_state) {
            const light_position = vec4.apply(null, program_state.camera_transform.transposed()[3]);
            program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1)];
    }

    // Called once per frame of animation
    display(context, program_state) {
        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        } else{
            if(this.attached){
                if(this.attached().equals(this.initial_camera_location)){
                    program_state.set_camera(this.initial_camera_location);
            }
          }
        }

        // Setup Perspective Matrix
        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 100);

        // Keep track of program time
        const t = this.t = program_state.animation_time / 1000;
    }
}


export class DarkHouse extends DarkHouse_Base {
    // Create Objects 
    createObjectsInRoom(context, program_state, model_transform) {
        const t = program_state.animation_time / 1000;

        let sphere_model_transform = model_transform.times(Mat4.translation(5, 5, 1)).times(Mat4.rotation(Math.PI/2, 1, 0, 0)).times(Mat4.rotation(Math.PI/2*t, 0, 1, 0));
        let sphere2_model_transform = model_transform.times(Mat4.translation(6, -6, 1));

        let cube_model_transform = model_transform.times(Mat4.translation(0, 0, 1));
        let cube2_model_transform = model_transform.times(Mat4.translation(12, -10, 1));

        let torus_model_transform = model_transform.times(Mat4.translation(-5, -5, 2)).times(Mat4.scale(2.5, 2.5, 2));
        let cow_model_transform = model_transform.times(Mat4.translation(3, 3, 2)).times(Mat4.rotation(Math.PI / 2, 1, 0, 0));

        this.shapes.object1.draw(context, program_state, sphere_model_transform, this.materials.texture_sphere);
        this.shapes.object2.draw(context, program_state, sphere2_model_transform, this.materials.texture_minecraft);

        this.shapes.cube.draw(context, program_state, cube_model_transform, this.materials.texture_box);
        this.shapes.cube.draw(context, program_state, cube2_model_transform, this.materials.texture_woodbox);

        this.shapes.torus.draw(context, program_state, torus_model_transform, this.materials.texture_UFO);
        this.shapes.cow.draw(context, program_state, cow_model_transform, this.materials.cow_material);
    }

    // Helper method to create room
    createRoom(context, program_state, model_transform){
        let wall_model_transform_1 = model_transform.times(Mat4.scale(20, 20, 20));
        this.shapes.wall.draw(context, program_state, wall_model_transform_1, this.materials.texture_wall);

        let wall_model_transform_2 = wall_model_transform_1
            .times(Mat4.translation(1,0,1))
            .times(Mat4.rotation(Math.PI / 2, 0 , 1, 0));
        this.shapes.wall.draw(context, program_state, wall_model_transform_2, this.materials.texture_wall);

        let wall_model_transform_3 = wall_model_transform_2
            .times(Mat4.translation(-1,0,-1))
            .times(Mat4.rotation(Math.PI / 2, 0 , 1, 0));
        this.shapes.wall.draw(context, program_state, wall_model_transform_3, this.materials.texture_wall);

        let wall_model_transform_4 = wall_model_transform_3
            .times(Mat4.translation(1,0,1))
            .times(Mat4.rotation(Math.PI / 2, 0 , 1, 0));
        this.shapes.wall.draw(context, program_state, wall_model_transform_4, this.materials.texture_wall);

        let floor_model_transform = wall_model_transform_1
            .times(Mat4.translation(0,-1,1))
            .times(Mat4.rotation(Math.PI / 2, 1, 0, 0))
        this.shapes.wall.draw(context, program_state, floor_model_transform, this.materials.texture_wall);

        let ceiling_model_transform_ = wall_model_transform_1
            .times(Mat4.translation(0,1,1))
            .times(Mat4.rotation(Math.PI / 2, 1, 0, 0))
        this.shapes.wall.draw(context, program_state, ceiling_model_transform_, this.materials.texture_wall);
    }

    // Base setup for splash screens (start, pause, end game, win game)
    baseSetup(context, program_state, model_transform) {
        // Set lights
        program_state.lights = [new Light(vec4(0, 1, 1, 0), color(1, 1, 1, 1), 1000000)];
        // Set initial camera location
        program_state.set_camera(Mat4.look_at(...Vector.cast([0, 0, 4], [0, 0, 0], [0, 1, 0])));

        // Set initial position of box
        let start_message_transform = model_transform.times(Mat4.scale(2.5, 0.5, 0.5));
        this.shapes.cube.draw(context, program_state, start_message_transform, this.materials.start_background);
    }

    // Initial game start screen
    startGameSetup(context, program_state, model_transform) {
        this.baseSetup(context, program_state, model_transform);

        // Define text to be written
        let strings = ['Press Ctrl+S to Start'];
        const multi_line_string = strings[0].split("\n");
        for (let line of multi_line_string.slice(0, 30)) {
            let cube_side = Mat4.rotation(0, 1, 0, 0)
                                .times(Mat4.rotation(0, 0, 1, 0))
                                .times(Mat4.translation(-1.5, 0, 0.9));
            this.shapes.text.set_string(line, context.context);
            this.shapes.text.draw(context, program_state, cube_side.times(Mat4.scale(.1, .1, .1)), this.materials.text_image);
        }
    }

    // Pause game screen
    pauseGameSetup(context, program_state, model_transform) {
        this.baseSetup(context, program_state, model_transform);

        // Define text to be written
        let strings = ['\t\t\t\t\tGame Paused.\n\n\nPress Ctrl+P to Resume.'];
        const multi_line_string = strings[0].split("\n");
        let cube_side = Mat4.rotation(0, 1, 0, 0)
                            .times(Mat4.rotation(0, 0, 1, 0))
                            .times(Mat4.translation(-1.5, 0, 0.9));
        for (let line of multi_line_string.slice(0, 30)) {
            this.shapes.text.set_string(line, context.context);
            this.shapes.text.draw(context, program_state, cube_side.times(Mat4.scale(.1, .1, .1)), this.materials.text_image);
            cube_side.post_multiply(Mat4.translation(0, -0.09, 0));
        }
    }

    // Game Lost Screen
    gameLostScreen(context, program_state, model_transform) {
        this.baseSetup(context, program_state, model_transform);

        // Define text to be written
        let strings = ['Game Over. You Lost.'];
        const multi_line_string = strings[0].split("\n");
        let cube_side = Mat4.rotation(0, 1, 0, 0)
                            .times(Mat4.rotation(0, 0, 1, 0))
                            .times(Mat4.translation(-1.5, 0, 0.9));
        for (let line of multi_line_string.slice(0, 30)) {
            this.shapes.text.set_string(line, context.context);
            this.shapes.text.draw(context, program_state, cube_side.times(Mat4.scale(.1, .1, .1)), this.materials.text_image);
        }
    }

    // Game Won Screen
    gameWonScreen(context, program_state, model_transform) {
        this.baseSetup(context, program_state, model_transform);

        // Define text to be written
        let strings = ['\t\t\t\tYou Won!\n\n\nYou took ' + this.currentGameTime.toFixed(2) + 's.'];
        const multi_line_string = strings[0].split("\n");
        let cube_side = Mat4.rotation(0, 1, 0, 0)
                            .times(Mat4.rotation(0, 0, 1, 0))
                            .times(Mat4.translation(-1, 0, 0.9));
        for (let line of multi_line_string.slice(0, 30)) {
            this.shapes.text.set_string(line, context.context);
            this.shapes.text.draw(context, program_state, cube_side.times(Mat4.scale(.1, .1, .1)), this.materials.text_image);
            cube_side.post_multiply(Mat4.translation(0, -0.09, 0));
        }
    }

    // Check game status : Determines if player has won or lost
    getGameState() {
        // If all objects have been found
        if ((this.allObjectsFound) && (this.currentGameTime > 0)) {
            this.victory = true;
        }
        // All objects found but time has run out
        else if (this.allObjectsFound && (this.currentGameTime <= 0)) {
            this.victory = false;
        }
        // If time has run out
        else if (this.currentGameTime <= 0) {
            this.endGame = true;
            this.victory = false;
        }
    }

    // Set game counter to 60 seconds
    updateGameTime(program_state) {
        // Initially, set timer to 60s
        if (!this.timeUpdated){
            this.currentGameTime = 60;
            this.timeUpdated = true;
        } 
        // Once timer is set, decrement the relative change in time per frame from initial time
        else {
            this.currentGameTime = this.currentGameTime - (program_state.animation_delta_time/1000);
        }
        console.log(this.currentGameTime);
    }

    // Main display function to create objects in the room
    display(context, program_state) {
        // Call the setup code that we left inside the base class
        super.display(context, program_state);
        let model_transform = Mat4.identity();

        // Start game is set to true
        if (this.startGame) {
            // If the game is not paused
            if (!this.pauseGame) {
                // If the game is not over 
                if (!this.endGame) {
                    // Initialize Camera
                    program_state.set_camera(this.initial_camera_location);
                    // Get current game state
                    this.getGameState();
                    // Initialize game time / update current game time
                    this.updateGameTime(program_state);
                    // Attach light to camera
                    this.attach_light_to_camera(program_state);
                    // Create main room object
                    this.createRoom(context, program_state, model_transform);
                    // Create objects in the room
                    this.createObjectsInRoom(context, program_state, model_transform);
                    // Initialize mouse position
                    let mouse_x = 0;
                    let mouse_y = 0;
                    // Update mouse position
                    if (defs.canvas_mouse_pos) {
                        mouse_x = defs.canvas_mouse_pos[0];
                        mouse_y = defs.canvas_mouse_pos[1];
                    }
                }
                // Game over 
                else {
                    // Check for victory and display victory screen
                    if (this.victory) {
                        this.gameWonScreen(context, program_state, model_transform);
                    } 
                    // Otherwise the user lost, so display lost screen
                    else {
                        this.gameLostScreen(context, program_state, model_transform);
                    }
                }
            } 
            // Game is paused
            else {
                this.pauseGameSetup(context, program_state, model_transform);
            }
        }
        // Start game is set to false, so display message indicating controls to start game
        else {
            this.startGameSetup(context, program_state, model_transform);
        }

    }
}
