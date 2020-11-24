import {defs, tiny} from './examples/common.js';
import {Shape_From_File} from './examples/obj-file-demo.js';
// Pull these names into this module's scope for convenience:
const {vec3, vec4, color, hex_color, Mat4, Light, Shape, Material, Shader, Texture, Scene} = tiny;
const {Triangle, Square, Tetrahedron, Torus, Windmill, Cube, Subdivision_Sphere, Cylindrical_Tube, Textured_Phong} = defs;


export class DarkHouse_Base extends Scene {

    // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
    constructor() {
        super();
        this.shapes = {
            wall: new Square(),
            cube: new Cube(),
            torus: new defs.Torus(3, 15),
            object1: new defs.Subdivision_Sphere(4),
            object2: new defs.Subdivision_Sphere(2),
            cow: new Shape_From_File("assets/spot_triangulated.obj")
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
            })
        };

        // Level height for the camera
        this.initial_camera_location = Mat4.look_at(vec3(-10, 3, 0), vec3(0, 3, 0), vec3(0, 1, 0)).times(Mat4.rotation(- Math.PI/2, 1, 0, 0));
    }

    // Setup Game Controls
    make_control_panel() {
        // Show live time
        // TODO: put the time information show up some how (make a decision first)
//         this.live_string(box => {
//             box.textContent = "Current Game Duration: " + (this.t) + " seconds."
//         });

//         this.new_line();
//         this.new_line();

        this.control_panel.innerHTML += "DarkHouse Game Controls: ";

        this.new_line();
        this.new_line();

        // Add buttons so the user can actively toggle camera positions
        this.key_triggered_button("Return To Start", ["Control", "c"], () => this.attached = () => this.initial_camera_location);
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


        // *** Lights: *** Values of vector or point lights.
        this.attach_light_to_camera(program_state);
    }
}


export class DarkHouse extends DarkHouse_Base {

    // Create Objects 
    createObjectsInRoom(context, program_state, model_transform) {

        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;

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
        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;
        const angle = t;

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

    // Main display function to create objects in the room
    display(context, program_state) {
        // Call the setup code that we left inside the base class
        super.display(context, program_state);

        let model_transform = Mat4.identity();

        // Create main room object
        this.createRoom(context, program_state, model_transform);

        // Create objects in the room
        this.createObjectsInRoom(context, program_state, model_transform);

        // Get mouse position
        let mouse_x = 0;
        let mouse_y = 0;

        if (defs.canvas_mouse_pos) {
            mouse_x = defs.canvas_mouse_pos[0];
            mouse_y = defs.canvas_mouse_pos[1];
        }

        if (defs.pos) {
            console.log(defs.pos);
        }
    }
}
