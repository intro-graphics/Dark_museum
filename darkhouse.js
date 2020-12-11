import { defs, tiny } from './examples/common.js';
import { Shape_From_File } from './examples/obj-file-demo.js';
// Pull these names into this module's scope for convenience:
const { vec3, vec4, Vector, color, hex_color, Mat4, Light, Shape, Material, Shader, Texture, Scene } = tiny;
const { Triangle, Square, Tetrahedron, Torus, Windmill, Cube, Subdivision_Sphere, Cylindrical_Tube, Textured_Phong, Textured_Phong_text, Phong_Shader } = defs;

// For writing game text
import { Text_Line } from './text-line.js';

export class DarkHouse_Base extends Scene {

  // constructor(): Add shapes and materials
  constructor() {
    super();

    // Load background music
    this.background_music = new Audio('background_song.mp3');

    this.startGame = false;
    this.pauseGame = false;
    this.endGame = false;
    this.allObjectsFound = false;

    // For keep tracking of current time in game
    this.timeUpdated = false;
    this.gameDuration = 60;
    this.currentGameTime = 60;

    // For tracking victory
    this.victory = false;

    // Tracking music state
    this.musicStarted = false;

    this.torus_speed = -2;
    this.torus_y = 0;

    // For Total object Count;
    this.centers = new Array(9).fill(0);
    this.short_bounce = false;

    // Models
    this.shapes = {
      wall: new Square(),
      cube: new Cube(),
      torus: new defs.Torus(3, 15),
      object1: new defs.Subdivision_Sphere(4),
      object2: new defs.Subdivision_Sphere(2),
      cow: new Shape_From_File("assets/spot_triangulated.obj"),
      pedestal: new Shape_From_File("assets/Pedestal.obj"),
      statue: new Shape_From_File("assets/thinker.obj"),
      vase: new Shape_From_File("assets/vase.obj"),
      bull: new Shape_From_File("assets/wallstreetbull.obj"),
      bench: new Shape_From_File("assets/Burri_Maro_oRL.obj"),
      text: new Text_Line(35)
    };

    // For Colliders
    this.colliders = [
      { intersect_test: this.intersect_sphere, points: new defs.Subdivision_Sphere(1), leeway: .5 },
      { intersect_test: this.intersect_sphere, points: new defs.Subdivision_Sphere(2), leeway: .3 },
      { intersect_test: this.intersect_cube, points: new defs.Cube(), leeway: .1 }
    ];

    //For Objects Found Dictionary
    this.object_found = {
      "Objects List": true,
      "Toy cow": false,
      "Vase": false,
      "Thinker": false,
      "Rubix cube": false,
      "Globe": false,
      "Charging bull": false
    }

    // Track index for objects
    this.object_index = {
      0: "Toy cow",
      2: "Thinker",
      3: "Vase",
      4: "Charging bull",
      7: "Globe",
      8: "Rubix cube"
    }

    // TODO: set better wall material
    this.materials = {
      wall_material: new Material(new defs.Phong_Shader(),
        { ambient: 0.1, diffusivity: 0.9, color: hex_color("#ffffff") }),

      texture_box: new Material(new Textured_Phong(), {
        color: hex_color("#ffffff"),
        ambient: 0.1, diffusivity: 0.9, specularity: 0.1,
        texture: new Texture("assets/rubiks-cube.png")
      }),

      texture_sphere: new Material(new Textured_Phong(), {
        color: hex_color("#ffffff"),
        ambient: 0.1, diffusivity: 0.9, specularity: 0.1,
        texture: new Texture("assets/earth.gif")
      }),

      texture_minecraft: new Material(new Textured_Phong(), {
        color: hex_color("#ffffff"),
        ambient: 0.1, diffusivity: 0.9, specularity: 0.1,
        texture: new Texture("assets/minecraft.jpg")
      }),

      texture_woodbox: new Material(new Textured_Phong(), {
        color: hex_color("#ffffff"),
        ambient: 0.1, diffusivity: 0.9, specularity: 0.1,
        texture: new Texture("assets/woodbox.jpg")
      }),

      texture_UFO: new Material(new Textured_Phong(), {
        color: hex_color("#ffffff"),
        ambient: 0.1, diffusivity: 1, specularity: 0.1,
        texture: new Texture("assets/UFO.jpg")
      }),

      //museum floor/wall texture
      texture_floor: new Material(new Textured_Phong(), {
        color: hex_color("#ffffff"),
        ambient: 0.1, diffusivity: 1, specularity: 0.1,
        texture: new Texture("assets/floor.jpeg")
      }),

      texture_wall: new Material(new Textured_Phong(), {
        color: hex_color("#ffffff"),
        ambient: 0.1, diffusivity: 1, specularity: 0.1,
        texture: new Texture("assets/marble.jpg")
      }),

      //painting textures
      texture_painting1: new Material(new Textured_Phong(), {
        color: hex_color("#ffffff"),
        ambient: 0.1, diffusivity: 1, specularity: 0.1,
        texture: new Texture("assets/starrynight.jpg")
      }),

      texture_painting2: new Material(new Textured_Phong(), {
        color: hex_color("#ffffff"),
        ambient: 0.1, diffusivity: 0.5, specularity: 0.1,
        texture: new Texture("assets/monalisa.jpg")
      }),

      texture_painting3: new Material(new Textured_Phong(), {
        color: hex_color("#ffffff"),
        ambient: 0.1, diffusivity: 1, specularity: 0.1,
        texture: new Texture("assets/monet1.jpg")
      }),

      texture_painting4: new Material(new Textured_Phong(), {
        color: hex_color("#ffffff"),
        ambient: 0.1, diffusivity: 1, specularity: 0.1,
        texture: new Texture("assets/irises.jpg")
      }),

      texture_painting5: new Material(new Textured_Phong(), {
        color: hex_color("#ffffff"),
        ambient: 0.1, diffusivity: 1, specularity: 0.1,
        texture: new Texture("assets/the-scream.jpg")
      }),

      texture_painting6: new Material(new Textured_Phong(), {
        color: hex_color("#ffffff"),
        ambient: 0.1, diffusivity: 1, specularity: 0.1,
        texture: new Texture("assets/chineselandscape.jpg")
      }),

      texture_painting7: new Material(new Textured_Phong(), {
        color: hex_color("#ffffff"),
        ambient: 0.1, diffusivity: 1, specularity: 0.1,
        texture: new Texture("assets/pearlearring.jpeg")
      }),

      texture_painting8: new Material(new Textured_Phong(), {
        color: hex_color("#ffffff"),
        ambient: 0.1, diffusivity: 1, specularity: 0.1,
        texture: new Texture("assets/memory.JPG")
      }),

      texture_painting9: new Material(new Textured_Phong(), {
        color: hex_color("#ffffff"),
        ambient: 0.1, diffusivity: 1, specularity: 0.1,
        texture: new Texture("assets/convergence.jpg")
      }),

      texture_painting10: new Material(new Textured_Phong(), {
        color: hex_color("#ffffff"),
        ambient: 0.1, diffusivity: 1, specularity: 0.1,
        texture: new Texture("assets/composition.jpg")
      }),

      //statue and figures textures
      texture_pedestal: new Material(new Textured_Phong(), {
        color: hex_color("#ffffff"),
        ambient: 0.1, diffusivity: 1, specularity: 0.1,
        texture: new Texture("assets/pedestal.jpg")
      }),

      texture_statue: new Material(new Textured_Phong(), {
        color: hex_color("#ffffff"),
        ambient: 0.1, diffusivity: 1, specularity: 0.1,
        texture: new Texture("assets/thinker_diffuse.jpg")
      }),

      texture_vase: new Material(new Textured_Phong(), {
        color: hex_color("#ffffff"),
        ambient: 0.1, diffusivity: 1, specularity: 0.1,
        texture: new Texture("assets/china.jpg")
      }),

      texture_bull: new Material(new Textured_Phong(), {
        color: hex_color("#ffffff"),
        ambient: 0.1, diffusivity: 1, specularity: 0.1,
        texture: new Texture("assets/13927_Charging_Bull_Statue_of_Wall_Street_diff.jpg")
      }),

      texture_bench: new Material(new Textured_Phong(), {
        color: hex_color("#ffffff"),
        ambient: 0.1, diffusivity: 1, specularity: 0.1,
        texture: new Texture("assets/burrimaro.jpg")
      }),

      sphere_material: new Material(new defs.Phong_Shader(),
        { ambient: 0.1, diffusivity: 1, specularity: 0.5, color: hex_color("#252F2F") }),

      cube_material: new Material(new defs.Phong_Shader(),
        { ambient: 0.1, diffusivity: 1, specularity: 0.5, color: hex_color("#0398FC") }),

      torus_material: new Material(new defs.Phong_Shader(),
        { ambient: 0.1, diffusivity: 1, specularity: 0.5, color: hex_color("#FCBA03") }),

      cow_material: new Material(new defs.Fake_Bump_Map(1), {
        color: color(.5, .5, .5, 1),
        ambient: 0.1, diffusivity: 1, specularity: 1, texture: new Texture("assets/spot_texture.png")
      }),

      start_background: new Material(new Phong_Shader(), {
        color: color(0, 0.5, 0.5, 1), ambient: 0,
        diffusivity: 0, specularity: 0, smoothness: 20
      }),

      time_background: new Material(new Phong_Shader(), {
        color: color(161, 31, 31, 1), ambient: 0,
        diffusivity: 0, specularity: 0.3, smoothness: 50
      }),

      // To show text you need a Material like this one:
      text_image: new Material(new Textured_Phong(1), {
        ambient: 1, diffusivity: 0, specularity: 0,
        texture: new Texture("assets/text.png")
      }),

      // to show text that is attached to the screen, use this:
      text_image_screen: new Material(new Textured_Phong_text(1), {
        ambient: 1, diffusivity: 0, specularity: 0,
        texture: new Texture("assets/text.png")
      })

    };

    // Level height for the camera
    this.initial_camera_location = Mat4.look_at(vec3(-10, 3, 0), vec3(0, 3, 0), vec3(0, 1, 0)).times(Mat4.rotation(- Math.PI / 2, 1, 0, 0));
  }

  // Function to reset all game controls to initialized state
  reset() {
    // Reset all objects found to false except Object List
    for (var key in this.object_found) {
      if (this.object_found.hasOwnProperty(key)) {
        if (key != 'Objects List') {
          this.object_found[key] = false;
        }
      }
    }
    this.startGame = false;
    this.pauseGame = false;
    this.endGame = false;
    this.allObjectsFound = false;
    this.timeUpdated = false;
    this.currentGameTime = 60;
    this.victory = false;
    // Pause since game is over
    this.background_music.pause();
    // Reinstantiate background music audio file to it can start from the beginning
    this.background_music = new Audio('background_song.mp3');
    this.musicStarted = false;
  }

  get_eye_location(program_state) {
    const O = vec4(0, 0, 0, 1), camera_center = program_state.camera_transform.times(O);
    return camera_center;
  }

  // Setup Game Controls
  make_control_panel() {
    this.control_panel.innerHTML += "DarkHouse Main Game Controls: ";
    this.new_line(); this.new_line();

    // Start Game
    this.key_triggered_button("Start Game", ["Control", "s"], () => {
      this.startGame = true;
      // Only play if the song has never been played before
      if (!this.musicStarted) {
        this.background_music.play();
        this.musicStarted = true;
      }
    });
    this.new_line(); this.new_line();

    // Pause Game
    this.key_triggered_button("Pause Game", ["Control", "p"], () => {
      // Only toggle once game has started and game has not ended
      if (this.startGame && !this.endGame) {
        this.pauseGame = !this.pauseGame;
        if (!this.background_music.paused) {
          this.background_music.pause();
        } else {
          this.background_music.play();
        }
      }
    });
    this.new_line(); this.new_line();

    // Restart Game
    this.key_triggered_button("Restart Game", ["Control", "r"], () => {
      this.reset();
    });
    this.new_line(); this.new_line();

    // Add buttons so the user can actively toggle camera positions

    this.key_triggered_button("Return To Initial Position", ["Control", "o"], () => this.attached = () => this.initial_camera_location);
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
    } else {
      if (this.attached) {
        if (this.attached().equals(this.initial_camera_location)) {
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
    const t = program_state.animation_time / 1000;

    let sphere_model_transform = model_transform.times(Mat4.translation(-16, -10, 1)).times(Mat4.rotation(Math.PI / 2, 1, 0, 0)).times(Mat4.rotation(Math.PI / 2 * t, 0, 1, 0));

    let cube_model_transform = model_transform.times(Mat4.translation(2, -4, 2)).times(Mat4.scale(0.25, 0.25, 0.25));

    let cow_model_transform = model_transform.times(Mat4.translation(-3, 4, 2.6)).times(Mat4.rotation(Math.PI / 2, 1, 0, 0)).times(Mat4.scale(0.7, 0.7, 0.7));

    //painting model transforms
    let painting1_model_transform = model_transform.times(Mat4.translation(19.5, 0, 9)).times(Mat4.rotation(Math.PI / 2, 1, 0, 0)).times(Mat4.scale(0.1, 4, 7));
    let painting2_model_transform = model_transform.times(Mat4.translation(19.5, 13, 6)).times(Mat4.rotation(Math.PI / 2, 1, 0, 0)).times(Mat4.scale(0.1, 4, 3));

    let painting3_model_transform = model_transform.times(Mat4.translation(3, 19.5, 6)).times(Mat4.rotation(Math.PI / 2, 1, 0, 0)).times(Mat4.scale(4, 5, 0.1));
    let painting4_model_transform = model_transform.times(Mat4.translation(-9, 19.5, 7)).times(Mat4.rotation(Math.PI / 2, 1, 0, 0)).times(Mat4.scale(4, 3, 0.1));
    let painting5_model_transform = model_transform.times(Mat4.translation(14, 19.5, 8)).times(Mat4.rotation(Math.PI / 2, 1, 0, 0)).times(Mat4.scale(3, 4, 0.1));

    let painting6_model_transform = model_transform.times(Mat4.translation(4, -19.5, 8)).times(Mat4.rotation(Math.PI / 2, 1, 0, 0)).times(Mat4.scale(8, 4, 0.1));
    let painting7_model_transform = model_transform.times(Mat4.translation(-10, -19.5, 6)).times(Mat4.rotation(Math.PI / 2, 1, 0, 0)).times(Mat4.scale(2.25, 3, 0.1));

    let painting8_model_transform = model_transform.times(Mat4.translation(-19.5, 2, 8)).times(Mat4.rotation(Math.PI / 2, 1, 0, 0)).times(Mat4.scale(0.1, 3, 7));
    let painting9_model_transform = model_transform.times(Mat4.translation(-19.5, -10, 6)).times(Mat4.rotation(Math.PI / 2, 1, 0, 0)).times(Mat4.scale(0.1, 3, 2.25));
    let painting10_model_transform = model_transform.times(Mat4.translation(-19.5, 15, 10)).times(Mat4.rotation(Math.PI / 2, 1, 0, 0)).times(Mat4.scale(0.1, 3, 4));

    let pedestal_model_transform = model_transform.times(Mat4.translation(16, -16, 0)).times(Mat4.scale(3, 3, 5));
    let statue_model_transform = model_transform.times(Mat4.translation(-16, -16, 6)).times(Mat4.rotation(Math.PI * 2, 0, 0, 1)).times(Mat4.scale(-3, -3, 3));
    let vase_model_transform = model_transform.times(Mat4.translation(16, -16, 10)).times(Mat4.scale(1.2, 1.2, 1.2));
    let bull_model_transform = model_transform.times(Mat4.translation(-15, 14, 2.5)).times(Mat4.scale(3, 3, 3));
    let bench1_model_transform = model_transform.times(Mat4.translation(0, -4, 1.5)).times(Mat4.scale(3, 3, 2));
    let bench2_model_transform = model_transform.times(Mat4.translation(0, 4, 1.5)).times(Mat4.scale(3, 3, 2));

    // Center position for each object and its x, y dimension.
    // Center position, x, y
    this.centers[0] = [...cow_model_transform.transposed()[3], 2, 4];
    this.centers[1] = [...pedestal_model_transform.transposed()[3], 3, 3];
    this.centers[2] = [...statue_model_transform.transposed()[3], 4, 5];
    this.centers[3] = [...vase_model_transform.transposed()[3], 6, 6];
    this.centers[4] = [...bull_model_transform.transposed()[3], 6, 3];
    this.centers[5] = [...bench1_model_transform.transposed()[3], 1.5, 5];
    this.centers[6] = [...bench2_model_transform.transposed()[3], 1.5, 5];
    this.centers[7] = [...sphere_model_transform.transposed()[3], 3, 3];
    this.centers[8] = [...cube_model_transform.transposed()[3], 2, 2];

    this.distances = this.centers.map((pos) => {
      const camera_position = this.get_eye_location(program_state);
      return [
        Math.abs(camera_position[1] - pos[1]),
        Math.abs(camera_position[0] - pos[0]),
        pos[4],
        pos[5]
      ];
    });

    this.detect_Collision(this.distances, 1);

    this.shapes.object1.draw(context, program_state, sphere_model_transform, this.materials.texture_sphere);
    //this.shapes.object2.draw(context, program_state, sphere2_model_transform, this.materials.texture_minecraft);

    this.shapes.cube.draw(context, program_state, cube_model_transform, this.materials.texture_box);
    //this.shapes.cube.draw(context, program_state, cube2_model_transform, this.materials.texture_woodbox);

    //this.shapes.torus.draw(context, program_state, torus_model_transform, this.materials.texture_UFO);
    this.shapes.cow.draw(context, program_state, cow_model_transform, this.materials.cow_material);

    //paintings
    this.shapes.cube.draw(context, program_state, painting1_model_transform, this.materials.texture_painting1);
    this.shapes.cube.draw(context, program_state, painting2_model_transform, this.materials.texture_painting2);

    this.shapes.cube.draw(context, program_state, painting3_model_transform, this.materials.texture_painting3);
    this.shapes.cube.draw(context, program_state, painting4_model_transform, this.materials.texture_painting4);
    this.shapes.cube.draw(context, program_state, painting5_model_transform, this.materials.texture_painting5);

    this.shapes.cube.draw(context, program_state, painting6_model_transform, this.materials.texture_painting6);
    this.shapes.cube.draw(context, program_state, painting7_model_transform, this.materials.texture_painting7);

    this.shapes.cube.draw(context, program_state, painting8_model_transform, this.materials.texture_painting8);
    this.shapes.cube.draw(context, program_state, painting9_model_transform, this.materials.texture_painting9);
    this.shapes.cube.draw(context, program_state, painting10_model_transform, this.materials.texture_painting10);

    this.shapes.pedestal.draw(context, program_state, pedestal_model_transform, this.materials.texture_pedestal);
    this.shapes.statue.draw(context, program_state, statue_model_transform, this.materials.texture_statue);
    this.shapes.vase.draw(context, program_state, vase_model_transform, this.materials.texture_vase);
    this.shapes.bull.draw(context, program_state, bull_model_transform, this.materials.texture_bull);
    this.shapes.bench.draw(context, program_state, bench1_model_transform, this.materials.texture_bench);
    this.shapes.bench.draw(context, program_state, bench2_model_transform, this.materials.texture_bench);
  }

  // Detect Collision and Give a small feedback
  detect_Collision(distances) {
    var obj = null;
    var counter = 0;

    const collide = distances.some((dist) => {
      if (dist[0] < dist[2] && dist[1] < dist[3]) {
        obj = counter;
      }
      counter += 1;
      return dist[0] < dist[2] && dist[1] < dist[3]
    });

    if (collide) {

      // Find object we collided with and set to true
      if (obj in this.object_index) {
        if (!this.object_found[this.object_index[obj]]) {
          const objectName = this.object_index[obj];
          console.log(objectName);
          this.object_found[objectName] = true;
        }
      }

      if (defs.left) {
        defs.thrust[0] = -0.3;
      } else if (defs.right) {
        defs.thrust[0] = 0.3;
      }

      if (defs.forward) {
        defs.thrust[2] = -0.3;
      } else if (defs.backward) {
        defs.thrust[2] = 0.3;
      }
      this.short_bounce = true;
    }

    else if (this.short_bounce) {
      defs.thrust[0] = 0;
      defs.thrust[2] = 0;
      this.short_bounce = false;
    }
  }

  // Helper method to create room
  createRoom(context, program_state, model_transform) {
    let floor_model_transform = model_transform.times(Mat4.scale(20, 20, 20));
    this.shapes.wall.draw(context, program_state, floor_model_transform, this.materials.texture_floor);

    let wall_model_transform_1 = floor_model_transform
      .times(Mat4.translation(2, 0, 1))
      .times(Mat4.rotation(-Math.PI / 2, 0, 1, 0))
      .times(Mat4.translation(0, 0, 1))

    this.shapes.wall.draw(context, program_state, wall_model_transform_1, this.materials.texture_wall);

    let wall_model_transform_2 = floor_model_transform
      .times(Mat4.translation(-2, 0, 1))
      .times(Mat4.rotation(Math.PI / 2, 0, 1, 0))
      .times(Mat4.translation(0, 0, 1));
    this.shapes.wall.draw(context, program_state, wall_model_transform_2, this.materials.texture_wall);

    let wall_model_transform_3 = floor_model_transform
      .times(Mat4.translation(0, 2, 1))
      .times(Mat4.rotation(Math.PI / 2, 1, 0, 0))
      .times(Mat4.translation(0, 0, 1));
    this.shapes.wall.draw(context, program_state, wall_model_transform_3, this.materials.texture_wall);

    let wall_model_transform_4 = floor_model_transform
      .times(Mat4.translation(0, -2, 1))
      .times(Mat4.rotation(-Math.PI / 2, 1, 0, 0))
      .times(Mat4.translation(0, 0, 1));
    this.shapes.wall.draw(context, program_state, wall_model_transform_4, this.materials.texture_wall);

    let ceiling_model_transform_ = floor_model_transform
      .times(Mat4.translation(0, 1, 1))
      .times(Mat4.rotation(Math.PI / 2, 1, 0, 0))
    this.shapes.wall.draw(context, program_state, ceiling_model_transform_, this.materials.texture_wall);
  }

  // Base setup for splash screens (start, pause, end game, win game)
  baseScreenSetup(context, program_state, model_transform) {
    // Set lights
    program_state.lights = [new Light(vec4(0, 1, 1, 0), color(1, 1, 1, 1), 1000000)];
    // Set initial camera location
    program_state.set_camera(Mat4.look_at(...Vector.cast([0, 0, 4], [0, 0, 0], [0, 1, 0])));

    // Set initial position of box
    let start_message_transform = model_transform.times(Mat4.scale(2.5, 0.5, 0.5));
    this.shapes.cube.draw(context, program_state, start_message_transform, this.materials.start_background);
  }

  // Base functionality for drawing text on surface of splash screens
  baseDrawText(context, program_state, multi_line_string, cube_side) {
    for (let line of multi_line_string.slice(0, 30)) {
      // Set the string using set_string
      this.shapes.text.set_string(line, context.context);
      // Draw but scale down to fit box size
      this.shapes.text.draw(context, program_state, cube_side.times(Mat4.scale(.1, .1, .1)), this.materials.text_image);
      // Use post multiply to move down to the next line
      cube_side.post_multiply(Mat4.translation(0, -0.09, 0));
    }
  }

  // Initial game start screen
  startGameSetup(context, program_state, model_transform) {
    this.baseScreenSetup(context, program_state, model_transform);
    // Define text to be written
    let strings = ['Welcome to the Dark House.\n\n\n\t\tPress Ctrl+S to Start.'];
    const multi_line_string = strings[0].split("\n");
    let cube_side = Mat4.rotation(0, 1, 0, 0)
      .times(Mat4.rotation(0, 0, 1, 0))
      .times(Mat4.translation(-1.8, 0, 0.9));
    // Draw text
    this.baseDrawText(context, program_state, multi_line_string, cube_side);
  }

  // Pause game screen
  pauseGameSetup(context, program_state, model_transform) {
    this.baseScreenSetup(context, program_state, model_transform);

    // Define text to be written
    let strings = ['\t\t\t\t\tGame Paused.\n\n\nPress Ctrl+P to Resume.'];
    const multi_line_string = strings[0].split("\n");
    let cube_side = Mat4.rotation(0, 1, 0, 0)
      .times(Mat4.rotation(0, 0, 1, 0))
      .times(Mat4.translation(-1.5, 0, 0.9));
    // Draw text
    this.baseDrawText(context, program_state, multi_line_string, cube_side);
  }

  // Game Lost Screen
  gameLostScreen(context, program_state, model_transform) {
    this.baseScreenSetup(context, program_state, model_transform);

    // Define text to be written
    let strings = ['\t\t\t\tGame Over. You Lost.\n\n\nPress Control+R To Restart.'];
    const multi_line_string = strings[0].split("\n");
    let cube_side = Mat4.rotation(0, 1, 0, 0)
      .times(Mat4.rotation(0, 0, 1, 0))
      .times(Mat4.translation(-1.9, 0, 0.9));
    // Draw text
    this.baseDrawText(context, program_state, multi_line_string, cube_side);
  }

  // Game Won Screen
  gameWonScreen(context, program_state, model_transform) {
    this.baseScreenSetup(context, program_state, model_transform);

    var timeTaken = 60 - this.currentGameTime;
    timeTaken = timeTaken.toFixed(2);
    // Define text to be written
    let strings = ['\t\t\t\tYou Won!\n\n\nYou took ' + timeTaken + 's.'];
    const multi_line_string = strings[0].split("\n");
    let cube_side = Mat4.rotation(0, 1, 0, 0)
      .times(Mat4.rotation(0, 0, 1, 0))
      .times(Mat4.translation(-1, 0, 0.9));
    // Draw text
    this.baseDrawText(context, program_state, multi_line_string, cube_side);
  }

  // Check game status : Determines if player has won or lost
  getGameState() {
    // If all objects have been found
    if (this.currentGameTime > 0) {
      for (var key in this.object_found) {
        if (this.object_found.hasOwnProperty(key)) {
          if (this.object_found[key] == false) {
            this.victory = false;
            return;
          }
        }
      }
      this.victory = true;
      this.endGame = true;
    }
    // All objects found but time has run out
    else if ((this.allObjectsFound) && (this.currentGameTime <= 0)) {
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
    if (!this.timeUpdated) {
      this.currentGameTime = this.gameDuration;
      this.timeUpdated = true;
    }
    // Once timer is set, decrement the relative change in time per frame from initial time
    else {
      this.currentGameTime = this.currentGameTime - (program_state.animation_delta_time / 1000);
    }
  }

  // Displays all live text: time remaining on top and objects found list on the side
  showLiveText(context, program_state, model_transform) {

    // Display current time remaining
    let strings = ['' + this.currentGameTime.toFixed(2) + 's'];
    const multi_line_string = strings[0].split("\n");
    let cube_side = Mat4.identity()
      .times(Mat4.scale(0.05, 0.05, 0.0))
      .times(Mat4.translation(-3, 18, 0));

    // Draw text
    for (let line of multi_line_string.slice(0, 30)) {
      // Set the string using set_string
      this.shapes.text.set_string(line, context.context);
      // Draw but scale down to fit box size
      // Create blinking effect
      if (this.currentGameTime < 11 && Math.floor(this.currentGameTime) % 2 == 0) {
        let text_color = color(1, 0, 0, 1);
        this.shapes.text.draw(context, program_state, cube_side, this.materials.text_image_screen.override({ color: text_color }));
      } else {
        this.shapes.text.draw(context, program_state, cube_side, this.materials.text_image_screen);
      }
    }

    var z_inc = 0;
    cube_side = cube_side.times(Mat4.scale(0.5, 0.75, 0));
    cube_side = cube_side.times(Mat4.translation(-30, 0, 0));

    for (var key in this.object_found) {
      cube_side = cube_side.times(Mat4.translation(0, -2, 0));
      let obj_strings = ['' + key];
      let text_color = color(1, 0, 0, 1);

      // Make sure objects list text remains white
      if (key == 'Objects List') {
        text_color = color(1, 1, 1, 1);
      }
      // If object is found, set the text color to green
      else if (this.object_found[key] == true)
        text_color = color(0, 1, 0, 1);
      // Default everything else to white
      else {
        text_color = color(1, 1, 1, 1);
      }

      const multi_line_string2 = obj_strings[0].split("\n");

      for (let line of multi_line_string2.slice(0, 30)) {

        // Set the string using set_string
        this.shapes.text.set_string(line, context.context);
        // Draw but scale down to fit box size
        this.shapes.text.draw(context, program_state, cube_side, this.materials.text_image_screen.override({ color: text_color }));
      }
      z_inc += 0.25;
    }
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
          // Show live time remaining
          this.showLiveText(context, program_state, model_transform);
          // Initialize game time / update current game time
          this.updateGameTime(program_state);
          // Attach light to camera
          // this.attach_light_to_camera(program_state);
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
          if (!this.background_music.paused) {
            this.background_music.pause();
          }
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
