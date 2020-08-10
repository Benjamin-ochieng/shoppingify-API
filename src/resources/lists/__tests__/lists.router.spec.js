import router from '../lists.router';

describe('listRouter', () => {
  it('has all the required paths and methods', () => {
    const crudRoutes = [];
    const baseRoutes = { path: '/', methods: { get: true, post: true } };
    const idRoutes = {
      path: '/:id',
      methods: {
        get: true,
        post: true,
        put: true,
        delete: true,
      },
    };
    router.stack.forEach(({ route }) => {
      const { path, methods } = route;
      crudRoutes.push({ path, methods });
    });
    expect(crudRoutes[0]).toEqual(baseRoutes);
    expect(crudRoutes[1]).toEqual(idRoutes);
  });
});
