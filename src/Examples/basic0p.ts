import {
    Scene,
    CanvasRenderer,
    View,
    Entity,
    DistantLight,
    MeshFactory,
} from '../Phoria';
import { Vector3, RADIANS } from '../Math';

export default function Example0p() : void {
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

    const c1 = MeshFactory.generateUnitCube(1);
    const cube1 = Entity.create({
        id: 'Cube Red',
        points: c1.points,
        polygons: c1.polygons,
        style: {
            color: [120, 0, 0],
        },
    });
    cube1.scaleN(1.25).rotateY(0.5).translateX(3);
    scene.graph.push(cube1);

    const c2 = MeshFactory.generateUnitCube(1);
    const cube2 = Entity.create({
        id: 'Cube Blue',
        points: c2.points,
        polygons: c2.polygons,
        style: {
            color: [0, 0, 120],
        },
    });
    cube2.rotateY(1.5).translateZ(-4);
    scene.graph.push(cube2);

    const c3 = MeshFactory.generateUnitCube(1);
    const cube3 = Entity.create({
        id: 'Cube Green',
        points: c3.points,
        edges: c3.edges,
        polygons: c3.polygons,
        style: {
            color: [0, 120, 0],
        },
    });
    cube3.scaleN(0.7).rotateX(0.8).translateY(3);
    scene.graph.push(cube3);

    // add a light
    scene.graph.push(DistantLight.create({
        direction: Vector3.fromValues(0, -0.5, 1),
        intensity: 1.25,
    }));

    // mouse rotation and position tracking
    let lastPicked : Entity | null = null;
    const lastColor: {
        [key: string]: [number, number, number];
    } = {};
    const picked = document.getElementById('picked');
    if (!picked) {
        return;
    }
    const mouse = View.addMouseEvents(canvas as HTMLCanvasElement, function() {
        if (!mouse) {
            return;
        }
        // pick object detection on mouse click
        const cpv = View.calculateClickPointAndVector(
            scene,
            mouse.clickPositionX,
            mouse.clickPositionY,
        );
        const intersects = View.getIntersectedObjects(
            scene,
            cpv.clickPoint,
            cpv.clickVector,
        );
        const pickedId = (intersects.length !== 0 ? intersects[0].entity.id : '[none]');
        picked.innerHTML = `Selected: ${pickedId}`;
        if (lastPicked !== null) {
            if (lastPicked.id !== null) {
                lastPicked.style.color = lastColor[lastPicked.id];
                lastPicked.style.emit = 0;
                lastPicked = null;
            }
        }
        if (intersects.length !== 0) {
            const obj = intersects[0].entity;
            if (obj.id !== null) {
                lastColor[obj.id] = obj.style.color;
                obj.style.color = [255, 255, 255];
                obj.style.emit = 0.5;
                lastPicked = obj;
                setTimeout(function() {
                    if (lastPicked !== null) {
                        if (lastPicked.id !== null) {
                            lastPicked.style.color = lastColor[lastPicked.id];
                            lastPicked.style.emit = 0;
                            lastPicked = null;
                        }
                    }
                }, 300);
            }
        }
    });

    let pause = false;
    const fnAnimate = () => {
        if (!pause) {
            // rotate cubes
            cube1.rotateY(0.5 * RADIANS);
            cube2.rotateX(0.5 * RADIANS);
            cube3.rotateZ(0.5 * RADIANS);
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
