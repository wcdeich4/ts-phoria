import {
    Scene,
    CanvasRenderer,
    Entity,
    DistantLight,
    MeshFactory,
} from '../../src/Phoria';
import { Vector3, RADIANS } from '../../src/Math';

export default function Example0() : void {
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
            drawmode: 'wireframe',
            shademode: 'plain',
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
    scene.graph.push(cube);
    scene.graph.push(new DistantLight());
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
        }
    });
    requestAnimationFrame(fnAnimate);
}
