import Example0 from './basic0';
import Example0t from './basic0t';
import Example0uv from './basic0uv';

const Examples: {
    [key: string]: () => void;
} = {
    // eslint-disable-next-line quote-props
    '0': Example0,
    '0t': Example0t,
    '0uv': Example0uv,
};

export default Examples;
