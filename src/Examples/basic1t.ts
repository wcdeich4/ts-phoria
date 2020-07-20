import {
    Scene,
    CanvasRenderer,
    Entity,
    PointLight,
    MeshFactory,
    ImagePreLoader,
} from '../Phoria';
import { Vector3, RADIANS } from '../Math';

export default function Example1t() : void {
    const bitmaps: HTMLImageElement[] = [];
    bitmaps.push(new Image());
    const loader = new ImagePreLoader();
    loader.addImage(bitmaps[0], 'images/texture-wall.png');
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
        const plane = MeshFactory.generateTesselatedPlane(16, 16, 0, 20, false);
        scene.graph.push(Entity.create({
            points: plane.points,
            edges: plane.edges,
            polygons: plane.polygons,
            style: {
                drawmode: 'wireframe',
                shademode: 'lightsource',
                linewidth: 0.5,
                objectsortmode: 'back',
            },
        }));
        const cube = MeshFactory.generateUnitCube(1.5);
        const testCube = Entity.create({
            points: cube.points,
            edges: cube.edges,
            polygons: cube.polygons,
            style: {
                texture: 0,
                opacity: 0.5,
                fillmode: 'fill',
                doublesided: true,
            },
        });
        // testCube.polygons[4].opacity = 0.5,
        testCube.textures.push(bitmaps[0]);
        scene.graph.push(testCube);

        const geom = MeshFactory.generateIcosahedron(1.5);
        const splitGeom = MeshFactory.subdivide(geom.points, geom.polygons);
        const childObj = Entity.create({
            points: splitGeom.points,
            polygons: splitGeom.polygons,
            style: {
                opacity: 0.5,
                fillmode: 'fill',
                doublesided: true,
            },
        });
        // add child object
        testCube.children.push(childObj);

        const blueLightObj = Entity.create({
            points: [
                Vector3.fromValues(0, 2, -5),
            ],
            style: {
                color: [0, 0, 255],
                drawmode: 'point',
                shademode: 'plain',
                linewidth: 5,
                linescale: 2,
            },
        });
        scene.graph.push(blueLightObj);
        const blueLight = PointLight.create({
            position: Vector3.fromValues(0, 2, -5),
            color: [0, 0, 1],
        });
        blueLightObj.children.push(blueLight);

        const redLightObj = Entity.create({
            points: [
                Vector3.fromValues(0, 2, 5),
            ],
            style: {
                color: [255, 0, 0],
                drawmode: 'point',
                shademode: 'plain',
                linewidth: 5,
                linescale: 2,
            },
        });
        scene.graph.push(redLightObj);
        const redLight = PointLight.create({
            position: Vector3.fromValues(0, 2, 5),
            color: [1, 0, 0],
        });
        redLightObj.children.push(redLight);

        const greenLightObj = Entity.create({
            points: [
                Vector3.fromValues(0, 2, 5),
            ],
            style: {
                color: [0, 255, 0],
                drawmode: 'point',
                shademode: 'plain',
                linewidth: 5,
                linescale: 2,
            },
        });
        scene.graph.push(greenLightObj);
        const greenLight = PointLight.create({
            position: Vector3.fromValues(0, 2, 5),
            color: [0, 1, 0],
        });
        greenLightObj.children.push(greenLight);

        const rotates = [0, 0, 0];
        let pause = false;
        const fnAnimate = () => {
            if (!pause) {
                // rotate local matrix of an object
                testCube.rotateY(0.5 * RADIANS);
                // translate local matrix of child object - will receive rotation from parent
                childObj.identity()
                    .rotateX(Math.sin(Date.now() / 1000) * 1)
                    .translateY(Math.sin(Date.now() / 1000) + 3);
                // translate visible light objects around the origin - will rotate child Light emitters
                const sine = Math.sin(Date.now() / 500);
                blueLightObj.identity()
                    .rotateY(rotates[0] += 1 * RADIANS)
                    .translateY(sine);
                redLightObj.identity()
                    .rotateY(rotates[1] += 0.5 * RADIANS)
                    .translateY(sine);
                greenLightObj.identity()
                    .rotateY(rotates[2] += 1.5 * RADIANS)
                    .translateY(sine);

                // execute the model view 3D pipeline
                scene.modelView();
                // and render the scene
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
