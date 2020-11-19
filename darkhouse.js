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

        };

        this.materials = {
   
        };
        
    }

    // Setup Game Controls
    make_control_panel() {
        // Show live time
        this.live_string(box => {
            box.textContent = "Current Game Duration: " + (this.t) + " seconds."
        });

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
    }
}


export class DarkHouse extends DarkHouse_Base {

    display(context, program_state) {
            
        // Call the setup code that we left inside the base class:
        super.display(context, program_state);

        let model_transform = Mat4.identity();

        // Position the root shape - place it at the coordinate origin 0,0,0:
        model_transform = model_transform.times(Mat4.translation(0, 0, 0));
        
    }
}