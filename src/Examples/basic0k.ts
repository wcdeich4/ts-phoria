import {
    Scene,
    CanvasRenderer,
    Entity,
    DistantLight,
    MeshFactory,
    ImagePreLoader,
} from '../Phoria';
import { Vector3, RADIANS } from '../Math';

export default function Example0k() : void {
    const bitmaps: HTMLImageElement[] = [];
    const loader = new ImagePreLoader();
    for (let i = 0; i < 6; i += 1) {
        bitmaps.push(new Image());
        loader.addImage(bitmaps[i], `images/texture${i}.png`);
    }
    loader.errorCallback = (file) => {
        alert(`Erro! Arquivo não encontrado: ${file}!`);
    };
    loader.onLoadCallback(() => {
        // get the canvas DOM element and the 2D drawing context
        const canvas = document.getElementById('canvas');
        if (!canvas) {
            return;
        }
        // create the scene and setup camera, perspective and viewport
        const scene = new Scene();
        scene.camera.position = Vector3.fromValues(0, 5, -15);
        scene.perspective.aspect = canvas.clientWidth / canvas.clientHeight;
        scene.viewport.width = canvas.clientWidth;
        scene.viewport.height = canvas.clientHeight;
        // create a canvas renderer
        const renderer = new CanvasRenderer(canvas as HTMLCanvasElement);
        // add a grid to help visualise camera position etc.
        const plane = MeshFactory.generateTesselatedPlane(8, 8, 0, 20, false);
        scene.graph.push(Entity.create({
            points: plane.points,
            edges: plane.edges,
            polygons: plane.polygons,
            style: {
                shademode: 'plain',
                drawmode: 'wireframe',
                linewidth: 0.5,
                objectsortmode: 'back',
            },
        }));
        const c = MeshFactory.generateUnitCube(1);
        const cube = Entity.create({
            points: c.points,
            edges: c.edges,
            polygons: c.polygons,
        });
        for (let i = 0; i < 6; i += 1) {
            cube.textures.push(bitmaps[i]);
            cube.polygons[i].texture = i;
        }
        scene.graph.push(cube);
        scene.graph.push(DistantLight.create({
            direction: Vector3.fromValues(0, -0.5, 1),
        }));

        let pause = false;
        const fnAnimate = () => {
            if (!pause) {
                // rotate local matrix of the cube
                cube.rotateY(0.5 * RADIANS);
                // execute the model view 3D pipeline and render the scene
                scene.modelView();
                renderer.render(scene);
            }
            requestAnimationFrame(fnAnimate);
        };

        // keep track of heading to generate position
        let heading = 0.0;
        const lookAt = Vector3.fromValues(0, -5, 15);

        const fnPositionLookAt = (
            forward: Vector3,
            heading: number,
            lookAt: Vector3,
        ) => {
            // recalculate camera position based on heading and forward offset
            const pos = scene.camera.position.clone();
            const ca = Math.cos(heading);
            const sa = Math.sin(heading);
            let rx = forward[0] * ca - forward[2] * sa;
            let rz = forward[0] * sa + forward[2] * ca;
            forward[0] = rx;
            forward[2] = rz;
            pos.add(forward);
            scene.camera.position[0] = pos[0];
            scene.camera.position[1] = pos[1];
            scene.camera.position[2] = pos[2];
            // calcuate rotation based on heading - apply to lookAt offset vector
            rx = lookAt[0] * ca - lookAt[2] * sa;
            rz = lookAt[0] * sa + lookAt[2] * ca;
            pos.add(Vector3.fromValues(rx, lookAt[1], rz));
            // set new camera look at
            scene.camera.lookat[0] = pos[0];
            scene.camera.lookat[1] = pos[1];
            scene.camera.lookat[2] = pos[2];
        };

        // key binding
        document.addEventListener('keydown', (e) => {
            if (e.keyCode === 27) { // esc
                pause = !pause;
            } else if (e.keyCode === 87) { // w
                // move forward along current heading
                fnPositionLookAt(Vector3.fromValues(0, 0, 1), heading, lookAt);
            } else if (e.keyCode === 83) { // s
                // move back along current heading
                fnPositionLookAt(Vector3.fromValues(0, 0, -1), heading, lookAt);
            } else if (e.keyCode === 65) { // a
                // strafe left from current heading
                fnPositionLookAt(Vector3.fromValues(-1, 0, 0), heading, lookAt);
            } else if (e.keyCode === 68) { // d
                // strafe right from current heading
                fnPositionLookAt(Vector3.fromValues(1, 0, 0), heading, lookAt);
            } else if (e.keyCode === 37) { // left
                // turn left
                heading += RADIANS * 4;
                // recalculate lookAt
                // given current camera position, project a lookAt vector along current heading for N units
                fnPositionLookAt(Vector3.fromValues(0, 0, 0), heading, lookAt);
            } else if (e.keyCode === 39) { // right
                // turn right
                heading -= RADIANS * 4;
                // recalculate lookAt
                // given current camera position, project a lookAt vector along current heading for N units
                fnPositionLookAt(Vector3.fromValues(0, 0, 0), heading, lookAt);
            } else if (e.keyCode === 38) { // up
                lookAt[1] += 1;
                fnPositionLookAt(Vector3.fromValues(0, 0, 0), heading, lookAt);
            } else if (e.keyCode === 40) { // down
                lookAt[1] -= 1;
                fnPositionLookAt(Vector3.fromValues(0, 0, 0), heading, lookAt);
            }
        });
        requestAnimationFrame(fnAnimate);
    });
}
