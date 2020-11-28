import {defs, tiny} from './examples/common.js';
import {Shape_From_File} from './examples/obj-file-demo.js';
// Pull these names into this module's scope for convenience:
const {vec3, vec4, color, hex_color, Mat4, Light, Shape, Material, Shader, Texture, Scene} = tiny;
const {Triangle, Square, Tetrahedron, Torus, Windmill, Cube, Subdivision_Sphere, Cylindrical_Tube} = defs;


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
                {ambient: 0.0, diffusivity: 1, specularity: 0.5, color: hex_color("#ffffff")}),
            floor_material: new Material(new defs.Phong_Shader(),
                {ambient: 0.0, diffusivity: 1, specularity: 0.5, color: hex_color("#8a5454")}),

            sphere_material: new Material(new defs.Phong_Shader(), {ambient: 0.0, diffusivity: 1, specularity: 0.5, color: hex_color("#252F2F")}),

            cube_material:  new Material(new defs.Phong_Shader(), {ambient: 0.0, diffusivity: 1, specularity: 0.5, color: hex_color("#0398FC")}),
            torus_material: new Material(new defs.Phong_Shader(), {ambient: 0.0, diffusivity: 1, specularity: 0.5, color: hex_color("#FCBA03")}),
            cow_material: new Material(new defs.Fake_Bump_Map(1), {
                color: color(.5, .5, .5, 1),
                ambient: 0.5, diffusivity: 1, specularity: 1, texture: new Texture("assets/spot_texture.png")
            })
        };


        this.initial_camera_location = Mat4.look_at(vec3(-10, 1, 0), vec3(0, 0, 0), vec3(0, 1, 0)).times(Mat4.rotation(- Math.PI/2, 1, 0, 0));
    }

    get_eye_location(program_state) {
        const O = vec4(0, 0, 0, 1), camera_center = program_state.camera_transform.times(O);
        return camera_center;
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
            const light_position = this.get_eye_location(program_state);
            program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];
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

        let sphere_model_transform = model_transform.times(Mat4.translation(5, 5, 1)).times(Mat4.rotation(Math.PI / 2 * t, 1, 0, 0));
        let sphere2_model_transform = model_transform.times(Mat4.translation(6, -6, 1));

        let cube_model_transform = model_transform.times(Mat4.translation(0, 0, 1));
        let cube2_model_transform = model_transform.times(Mat4.translation(12, -10, 1));

        let torus_model_transform = model_transform.times(Mat4.translation(-5, -5, 2)).times(Mat4.scale(2.5, 2.5, 2));
        let cow_model_transform = model_transform.times(Mat4.translation(3, 3, 2)).times(Mat4.rotation(Math.PI / 2, 1, 0, 0));

        this.shapes.object1.draw(context, program_state, sphere_model_transform, this.materials.sphere_material);
        this.shapes.object2.draw(context, program_state, sphere2_model_transform, this.materials.sphere_material.override(color(1, 0, 0, 1)));

        this.shapes.cube.draw(context, program_state, cube_model_transform, this.materials.cube_material);
        this.shapes.cube.draw(context, program_state, cube2_model_transform, this.materials.cube_material.override(color(0,1,0,1)));

        this.shapes.torus.draw(context, program_state, torus_model_transform, this.materials.torus_material);
        this.shapes.cow.draw(context, program_state, cow_model_transform, this.materials.cow_material);
    }

    // Helper method to create room
    createRoom(context, program_state, model_transform){
        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;
        const angle = t;

        let wall_model_transform_1 = model_transform.times(Mat4.scale(20, 20, 20));
        this.shapes.wall.draw(context, program_state, wall_model_transform_1, this.materials.floor_material);

        let wall_model_transform_2 = wall_model_transform_1
            .times(Mat4.translation(1,0,1))
            .times(Mat4.rotation(Math.PI / 2, 0 , 1, 0));
        this.shapes.wall.draw(context, program_state, wall_model_transform_2, this.materials.wall_material);

        let wall_model_transform_3 = wall_model_transform_2
            .times(Mat4.translation(-1,0,-1))
            .times(Mat4.rotation(Math.PI / 2, 0 , 1, 0));
        this.shapes.wall.draw(context, program_state, wall_model_transform_3, this.materials.wall_material);

        let wall_model_transform_4 = wall_model_transform_3
            .times(Mat4.translation(1,0,1))
            .times(Mat4.rotation(Math.PI / 2, 0 , 1, 0));
        this.shapes.wall.draw(context, program_state, wall_model_transform_4, this.materials.wall_material);

        let floor_model_transform = wall_model_transform_1
            .times(Mat4.translation(0,-1,1))
            .times(Mat4.rotation(Math.PI / 2, 1, 0, 0))
        this.shapes.wall.draw(context, program_state, floor_model_transform, this.materials.wall_material);

        let ceiling_model_transform_ = wall_model_transform_1
            .times(Mat4.translation(0,1,1))
            .times(Mat4.rotation(Math.PI / 2, 1, 0, 0))
        this.shapes.wall.draw(context, program_state, ceiling_model_transform_, this.materials.wall_material);
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
    }
}
