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
