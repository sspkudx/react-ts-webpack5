/**
 * @description Dispach loader according to your environent
 * @param {import('./types').EnvLoaderOption[]} envLoaderOptions
 * @param {string} envName env name
 * @returns {string} loader of current environent
 */
const dispachLoaderBasedOnEnv = (envLoaderOptions = [], envName = process.env.NODE_ENV) =>
    envLoaderOptions.reduce(
        (prev, cur) => ({
            ...prev,
            [cur.env]: cur.loader,
        }),
        {}
    )[envName] ?? '';

module.exports = {
    dispachLoaderBasedOnEnv,
};
