import {
    Scene,
    CanvasRenderer,
    Entity,
    DistantLight,
    MeshFactory,
    View,
} from '../Phoria';
import { Vector3, RADIANS } from '../Math';

export default function Example0r() : void {
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
    const c = MeshFactory.generateUnitCube(1.5);
    const cube = Entity.create({
        points: c.points,
        edges: c.edges,
        polygons: c.polygons,
    });
    for (let i = 0; i < 6; i += 1) {
        cube.polygons[i].color = [42 * i, 256 - (42 * i), (128 + (42 * i)) % 256];
    }
    scene.graph.push(cube);
    Entity.debug(cube, {
        showAxis: true,
    });
    // add a light
    scene.graph.push(DistantLight.create({
        direction: Vector3.fromValues(0, -0.5, 1),
    }));

    // mouse rotation and position tracking
    const mouse = View.addMouseEvents(canvas as HTMLCanvasElement);
    if (!mouse) {
        return;
    }
    // keep track of rotation
    const rot = {
        x: 0,
        y: 0,
        z: 0,
        velx: 0,
        vely: 0,
        velz: 0,
        nowx: 0,
        nowy: 0,
        nowz: 0,
        ratio: 0.1,
    };

    let pause = false;
    const fnAnimate = () => {
        if (!pause) {
            // rotate local matrix of the cube
            rot.nowx += (rot.velx = (mouse.velocityV - rot.x - rot.nowx) * rot.ratio);
            rot.nowy += (rot.vely = (rot.y - rot.nowy) * rot.ratio);
            rot.nowz += (rot.velz = (mouse.velocityH - rot.z - rot.nowz) * rot.ratio);
            cube.rotateX(-rot.velx * RADIANS)
                .rotateY(-rot.vely * RADIANS)
                .rotateZ(-rot.velz * RADIANS);
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
