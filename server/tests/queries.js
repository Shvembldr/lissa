const user = {
  getUser: `
    query user {
      me {
        name
        email
        role
      }
    }
  `,
};

const groups = {
  getGroups: `
    query groups {
      groups {
        id
        name
      }
    }
  `,
};

export { user, groups };
