import { reduce as _reduce, get as _get } from 'lodash';


const mapSpeedDataStructure = ({ data }) => {
    const structuredData = _reduce(_get(data, 'speed'), (acc, value, key) => {
        acc.push(value);
        return acc;
    }, []);
    return { speed: structuredData };
};

export {
    mapSpeedDataStructure,
}

