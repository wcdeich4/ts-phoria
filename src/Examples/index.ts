import Example0 from './basic0';
import Example0t from './basic0t';
import Example0uv from './basic0uv';
import Example0p from './basic0p';
import Example0r from './basic0r';
import Example0k from './basic0k';

const Examples: {
    [key: string]: () => void;
} = {
    // eslint-disable-next-line quote-props
    '0': Example0,
    '0t': Example0t,
    '0uv': Example0uv,
    '0p': Example0p,
    '0r': Example0r,
    '0k': Example0k,
};

export default Examples;
