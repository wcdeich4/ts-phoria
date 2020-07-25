import {
    Scene,
    CanvasRenderer,
    // Entities
    BaseEntity,
    Entity,
    BaseLight,
    DistantLight,
    PointLight,
    // Utils
    MeshFactory,
    ImagePreLoader,
    View,
} from './Phoria';
import {
    // Vector
    Vector2,
    Vector3,
    Vector4,
    // Matrix
    Matrix4,
    // constants
    RADIANS,
    EPSILON,
    TWOPI,
} from './Math';
import * as Util from './Phoria/Utils';

const Phoria = {
    // Vector
    Vector2,
    Vector3,
    Vector4,
    // Matrix
    Matrix4,
    // constants
    RADIANS,
    EPSILON,
    TWOPI,
    Scene,
    CanvasRenderer,
    BaseEntity,
    Entity,
    BaseLight,
    DistantLight,
    PointLight,
    MeshFactory,
    ImagePreLoader,
    View,
    Util,
};

export {
    CameraHandler,
    TriggerHandler,
    MouseTrackingInstance,
    Edge,
    Polygon,
    RenderHandle,
    EntityStyle,
    EntityStyleOptional,
    SceneHandler,
    BeforeSceneHandler,
} from './Phoria';

export default Phoria;
