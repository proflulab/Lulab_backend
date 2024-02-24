module.exports = (options) => {
  return async function auth(ctx, next) {
    // 获取当前路由
    const url = ctx.url;

    // 获取graphql接口名称
    const operationName = ctx.request.body.operationName;

    // 获取token
    const token = ctx.request.header.authorization;

    console.log(operationName + "_" + url);
    // console.log(this.app.config.env);
    switch (url) {
      case "/graphql":
        // 开启 GraphiQL IDE 调试时，所有的请求放过
        if (ctx.app.config.graphql.graphiql) {
          await next();
          return;
        }

        switch (operationName) {
          case "courseLink": {
            const retoken = await ctx.service.jwt.reToken(token);
            // 校验token,如果无法通过，则拒绝访问
            const chekToken = await ctx.service.jwt.verifyToken(retoken);

            // todo: 校验token黑名单(或白名单)，利用Redis进行缓存,如token被拉入黑名单(或白名单)，则拒绝访问。
            const chektList = true;
            // todo: 校验Uid权限,如Uid无权限，则拒绝访问。
            if (chekToken) {
              const res = await ctx.service.jwt.getUserIdFromToken(retoken);
              console.log(res.uid);
            }

            const chektAuth = true;

            if (!chekToken) return;
            if (!chektList) {
              return (ctx.response.body = { message: "该用户没有访问权限" });
            }
            if (!chektAuth) {
              return (ctx.response.body = { message: "该用户没有访问权限" });
            }

            return next();
          }
          case "logOut":
            return next();
          // 不需要auth check的API
          case "login":
            return next();
          case "sendcode":
            return next();
          case "checkcode":
            return next();

          default:
            return next();
        }

      // 预留给resful接口做权限管理
      case "/graphql?":
        return next();
      case "/other":
        return;
      default:
        return next();
    }
  };
};
