import axios from 'axios';

const isNumeric = (str) => {
    if (typeof str !== "string") return false // we only process strings!
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

const readFileAsync = (file) => {
    return new Promise((resolve, reject) => {
       let reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

const postCubeFromFile = async (name, file) => {
    try {
        let fileContent = await readFileAsync(file);
        const result =  await axios.post(`${host}/load_cube_form_file`, {
            name,
            content: fileContent.split(/\r?\n/).filter((line) => isNumeric(line)),
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return result.data;
    } catch (err) {
        return err;
    }
};

const getCubes = async () => {
    try {
        const result = await axios.get(`${host}/load_cube`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return result.data;
    } catch (err) {
        return err;
    }
}

const getCubeById = async (id) => {
    try {
        const result = await axios.get(`${host}/cubes/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return result.data;
    } catch (err) {
        return err;
    }
}

const getBoosters = async () => {
    try {
        const result = await axios.get(`${host}/boosters/`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return result.data;
    } catch (err) {
        return err;
    }
}

const postBoosterGameRule = async (data) => {
    try {
        const result =  await axios.post(`${host}/booster_game_rule`, data, {
            headers: { 'Content-Type': 'application/json', }
        });
        return result.data;
    } catch (err) {
        return err;
    }
};

const getGameRules = async () => {
    try {
        const result = await axios.get(`${host}/booster_game_rule/`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return result.data;
    } catch (err) {
        return err;
    }
};

const getGameRule = async (id) => {
    try {
        const result = await axios.get(`${host}/booster_game_rule/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return result.data;
    } catch (err) {
        return err;
    }
};

const openBooster = async (id) => {
    try {
        const result = await axios.get(`${host}/open_booster/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return result.data;
    } catch (err) {
        return err;
    }
};

const getCard = async (id) => {
    try {
        const result = await axios.get(`${host}/card/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return result.data;
    } catch (err) {
        return err;
    }
}

export {
    postCubeFromFile,
    getCubes,
    getCubeById,
    getBoosters,
    postBoosterGameRule,
    getGameRules,
    getGameRule,
    openBooster,
    getCard,
}
