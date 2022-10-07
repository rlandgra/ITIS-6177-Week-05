exports.handler = async (event) => {
    return "Ross says " + event["keyword"]
};