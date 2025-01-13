export const getHello = (req, res) => {
    const {name} = req.body;
    if (!name) return null;
    return "Hello World " + name;
}