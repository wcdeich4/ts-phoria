import {
    Scene,
    CanvasRenderer,
    Entity,
    DistantLight,
    MeshFactory,
    ImagePreLoader,
} from '../Phoria';
import { Vector3, RADIANS } from '../Math';

export default function Example0uv() : void {
    const loader = new ImagePreLoader();
    const bitmaps : HTMLImageElement[] = [];
    bitmaps.push(new Image(), new Image());
    loader.addImage(bitmaps[0], 'images/texture-wall.png');
    loader.addImage(bitmaps[1], 'images/texture5.png');
    loader.onLoadCallback(() => {
        // get the canvas DOM element and the 2D drawing context
        const canvas = document.getElementById('canvas');
        if (!canvas) {
            return;
        }
        // create the scene and setup camera, perspective and viewport
        const scene = new Scene();
        scene.camera.position = Vector3.fromValues(0, 20, -25);
        scene.camera.lookat = Vector3.fromValues(0, 1, 0);
        scene.perspective.aspect = canvas.clientWidth / canvas.clientHeight;
        scene.viewport.width = canvas.clientWidth;
        scene.viewport.height = canvas.clientHeight;
        // create a canvas renderer
        const renderer = new CanvasRenderer(canvas as HTMLCanvasElement);
        // add a subdivised plane to show benefit of uv coords on a large object
        const p = MeshFactory.generateTesselatedPlane(4, 4, 0, 20, true);
        const plane = Entity.create({
            points: p.points,
            edges: p.edges,
            polygons: p.polygons,
            style: {
                shademode: 'plain',
                texture: 0,
            },
        });
        plane.translateY(-1);
        plane.textures.push(bitmaps[1]);
        scene.graph.push(plane);
        // cube
        const c = MeshFactory.generateUnitCube(2);
        const cube = Entity.create({
            points: c.points,
            edges: c.edges,
            polygons: c.polygons,
        });
        cube.textures.push(bitmaps[1]);
        for (let i = 0; i < 4; i += 1) {
            cube.polygons[i].texture = 0;
            // test UV coords - select a quarter of the texture for the cube faces
            let x = 0;
            let y = 0;
            if (i === 0) {
                x = 0;
                y = 0;
            } else if (i === 1) {
                x = 0.5;
                y = 0;
            } else if (i === 2) {
                x = 0;
                y = 0.5;
            } else {
                x = 0.5;
                y = 0.5;
            }
            cube.polygons[i].uvs = [
                0 + x,
                0 + y,
                0.5 + x,
                0 + y,
                0.5 + x,
                0.5 + y,
                0 + x,
                0.5 + y,
            ];
        }
        scene.graph.push(cube);
        const py = MeshFactory.generatePyramid(2);
        const pyramid = Entity.create({
            points: py.points,
            edges: py.edges,
            polygons: py.polygons,
            style: {
                texture: 0,
            },
        });
        pyramid.textures.push(bitmaps[0]);
        for (let i = 0; i < 4; i += 1) {
            // test UV coords - select a section of the wall texture for the pyramid faces
            pyramid.polygons[i].uvs = [0.5, 0, 1, 0, 0.75, 0.5];
        }
        pyramid.translateY(2);
        scene.graph.push(pyramid);
        const s = MeshFactory.generateSphere(1.5, 8, 16, true);
        const sphere = Entity.create({
            points: s.points,
            polygons: s.polygons,
            style: {
                color: [255, 128, 64],
                diffuse: 0.5,
                specular: 64,
                texture: 0,
            },
        });
        sphere.translateY(6);
        sphere.translateX(2);
        sphere.textures.push(bitmaps[1]);
        // clone sphere
        const spherePlain = Entity.create({
            points: s.points,
            polygons: s.polygons,
            style: {
                shademode: 'plain',
                color: [255, 128, 64],
                diffuse: 0.5,
                specular: 64,
                texture: 0,
            },
        });
        spherePlain.translateY(6);
        spherePlain.translateX(2);
        spherePlain.translateX(-5);
        spherePlain.scale(Vector3.fromValues(1, 3, 1));
        spherePlain.textures.push(bitmaps[1]);
        scene.graph.push(sphere, spherePlain);

        scene.graph.push(DistantLight.create({
            direction: Vector3.fromValues(0, -1, 1),
            intensity: 1.5,
        }));

        let pause = false;
        const fnAnimate = () => {
            if (!pause) {
                // rotate local matrix of the cube
                cube.rotateY(0.5 * RADIANS);
                pyramid.rotateY(-0.25 * RADIANS);
                sphere.rotateY(-0.25 * RADIANS);
                spherePlain.rotateY(0.25 * RADIANS);
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
    });
}
