exports.create_milisec = () => {
    const milisec = (new Date()).getTime().toString();
    return Number(milisec.substring(0, milisec.length - 3));
}

exports.merge = (a1, a2, field) => {
    a1.forEach(element => {
        let index = a2.findIndex(x => x[field] == element[field]);
        if (index == -1) {
            a2.push(element);
        } else {
            a2[index].active = element.active;
        }
    });
    return a2
}