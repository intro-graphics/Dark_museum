import {defs, tiny} from './examples/common.js';

// Pull these names into this module's scope for convenience:
const {vec3, vec4, color, hex_color, Mat4, Light, Shape, Material, Shader, Texture, Scene} = tiny;
const {Triangle, Square, Tetrahedron, Windmill, Cube, Subdivision_Sphere} = defs;

export class DarkHouse_Base extends Scene {

    // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
    constructor() {
        super();

        this.initial_camera_location = Mat4.look_at(vec3(0, 10, 20), vec3(0, 0, 0), vec3(0, 1, 0));

        this.shapes = {
            wall: new Square(),
        };

        // TODO: set better wall material
        this.materials = {
            wall_material: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#ffffff")}),
        };

    }

    // Setup Game Controls
    make_control_panel() {
        // Show live time
        // TODO: put the time information show up some how (make a decision first)
        // this.live_string(box => {
        //     box.textContent = "Current Game Duration: " + (this.t) + " seconds."
        // });

        this.new_line();
        this.new_line();

        this.control_panel.innerHTML += "DarkHouse Game Controls: ";

        this.new_line();
        this.new_line();

        // Add buttons so the user can actively toggle camera positions
        this.key_triggered_button("Return To Start", ["Control", "c"], () => this.attached = () => this.initial_camera_location);
    }

    // Called once per frame of animation
    display(context, program_state) {

        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            program_state.set_camera(this.initial_camera_location);
        }

        // Setup Perspective Matrix
        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 100);

        // Keep track of program time
        const t = this.t = program_state.animation_time / 1000;

        // *** Lights: *** Values of vector or point lights.
        const light_position = vec4(0, 5, 5, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];
    }
}


export class DarkHouse extends DarkHouse_Base {

    display(context, program_state) {
        // Call the setup code that we left inside the base class:
        super.display(context, program_state);

        let model_transform = Mat4.identity();


        let wall_model_transform_1 = model_transform.times(Mat4.scale(10, 10, 10));
        this.shapes.wall.draw(context, program_state, wall_model_transform_1, this.materials.wall_material);

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
}