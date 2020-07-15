import BaseEntity from './BaseEntity';

export default class BaseLight extends BaseEntity {
    color: [number, number, number] = [1.0, 1.0, 1.0];

    intensity = 1.0;
}
