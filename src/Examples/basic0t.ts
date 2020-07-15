import {
    Scene,
    CanvasRenderer,
    Entity,
    DistantLight,
    MeshFactory,
    ImagePreLoader,
} from '../Phoria';
import { Vector3, RADIANS } from '../Math';

export default function Example0t() : void {
    const bitmaps: HTMLImageElement[] = [];
    const loader = new ImagePreLoader();
    for (let i = 0; i < 6; i += 1) {
        bitmaps.push(new Image());
        loader.addImage(bitmaps[i], `images/texture${i}.png`);
    }
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

        // key binding
        document.addEventListener('keydown', (e) => {
            if (e.keyCode === 27) {
                pause = !pause;
            } else if (e.keyCode === 32) {
                for (let i = 0; i < 6; i += 1) {
                    // cube.textures.push(bitmaps[i]);
                    cube.polygons[i].texture = 5 - i;
                }
            }
        });
        requestAnimationFrame(fnAnimate);
    });
}
