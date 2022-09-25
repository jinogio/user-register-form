const userPrefix = 'user:';
const counterPrefix = 'counter:';

const nextValue = (key) => {
    const lsKey = `${counterPrefix}${key}`;
    let value = localStorage.getItem(lsKey) || 0;
    value++;
    localStorage.setItem(lsKey, value);

    return value;
};

const listUserKeys = () => [...Array(localStorage.length).keys()]
    .map((i) => localStorage.key(i))
    .filter((key) => key.startsWith(userPrefix));

export const fetchUsers = () =>
    listUserKeys()
    .map((key) => localStorage.getItem(key))
    .map((json) => JSON.parse(json))
    .sort((a, b) => a.id - b.id);

export const removeUser = (id) => localStorage.removeItem(`${userPrefix}${id}`);

export const insertUser = (data) => {
    const id = nextValue('USER_ID_COUNTER');
    const record = Object.assign(data, { id });

    localStorage.setItem(`${userPrefix}${id}`, JSON.stringify(record));

    return record;
};