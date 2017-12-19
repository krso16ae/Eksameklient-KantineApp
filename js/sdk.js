const SDK = {
  serverURL: "http://localhost:8080/api",
  request: (options, cb) => {

   let headers = {};
    if (options.headers) {
      Object.keys(options.headers).forEach((h) => {
        headers[h] = (typeof options.headers[h] === 'object') ? JSON.stringify(options.headers[h]) : options.headers[h];
      });
    }

    $.ajax({
      url: SDK.serverURL + options.url,
      method: options.method,
      headers: headers,
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(options.data),
      success: (data, status, xhr) => {
        cb(null, data, status, xhr);
      },
      error: (xhr, status, errorThrown) => {
        cb({xhr: xhr, status: status, error: errorThrown});
      }
    });

  },
  Product: {
    addToPersonalOrder: (product) => {
      let order = SDK.Storage.load("order");

      //Has anything been added to the basket before?
      if (!order) {
        return SDK.Storage.persist("order", [{
          count: 1,
          product: product
        }]);
      }
/*
      //Does the book already exist?
      let foundBook = basket.find(b => b.book.id === book.id);
      if (foundBook) {
        let i = basket.indexOf(foundBook);
        basket[i].count++;
      } else {
        basket.push({
          count: 1,
          book: book
        });
      }
*/
      SDK.Storage.persist("basket", basket);
    },
    findAll: (cb) => {
      SDK.request({
        method: "GET",
        url: "/food",
        headers: {
          filter: {
           // include: ["authors"]
          }
        }
      }, cb);
    },
    create: (data, cb) => {
      SDK.request({
        method: "POST",
        url: "/user/create",
        data: data,
        headers: {authorization: SDK.Storage.load("tokenId")}
      }, cb);
    }
  },
 /* Author: {
    findAll: (cb) => {
      SDK.request({method: "GET", url: "/authors"}, cb);
    }
  }, */
  Order: {
    create: (data, cb) => {
      SDK.request({
        method: "POST",
        url: "/orders",
        data: data,
        headers: {authorization: SDK.Storage.load("tokenId")}
      }, cb);
    },
    findMine: (cb) => {
      SDK.request({
        method: "GET",
        url: "/orders" + SDK.User.current().id + "/allorders",
        headers: {
          authorization: SDK.Storage.load("tokenId")
        }
      }, cb);
    }
  },
  User: {
    findAll: (cb) => {
      SDK.request({method: "GET", url: "/staffs"}, cb);
    },
    current: () => {
      return SDK.Storage.load("users");
    },
    logOut: () => {
      SDK.Storage.remove("tokenId");
      SDK.Storage.remove("userId");
      SDK.Storage.remove("user");
      window.location.href = "index.html";
    },
    login: (username, password, cb) => {
      SDK.request({
        data: {
          username: username,
          password: password
        },
        url: "/users/login",
        method: "POST"
      }, (err, data) => {

        //On login-error
        if (err) return cb(err);
        SDK.Storage.persist("tokenId", data.id);
        SDK.Storage.persist("userId", data.userId);
        SDK.Storage.persist("user", data.user);

        cb(null, data);

      });
    },
      create: (username, password, cb) => {
          SDK.request({
              data: {
                  username: username,
                  password: password
              },
              url: "/users/create",
              method: "POST"
          }, (err, data) => {

              //On login-error
              if (err) return cb(err);
              SDK.Storage.persist("tokenId", data.id);
              SDK.Storage.persist("userId", data.userId);
              SDK.Storage.persist("user", data.user);

              cb(null, data);

          });
      },



    loadNav: (cb) => {
      $("#nav-container").load("nav.html", () => {
        const currentUser = SDK.User.current();
        if (currentUser) {
          $(".navbar-right").html(`
            <li><a href="home-page.html">Dine bestillinger</a></li>
            <li><a href="#" id="logout-link">Logout</a></li>
          `);
        } else {
          $(".navbar-right").html(`
            <li><a href="login.html">Log-in <span class="sr-only">(current)</span></a></li>
          `);
        }
        $("#logout-link").click(() => SDK.User.logOut());
        cb && cb();
      });
    }
  },
  Storage: {
    prefix: "BookStoreSDK",
    persist: (key, value) => {
      window.localStorage.setItem(SDK.Storage.prefix + key, (typeof value === 'object') ? JSON.stringify(value) : value)
    },
    load: (key) => {
      const val = window.localStorage.getItem(SDK.Storage.prefix + key);
      try {
        return JSON.parse(val);
      }
      catch (e) {
        return val;
      }
    },
    remove: (key) => {
      window.localStorage.removeItem(SDK.Storage.prefix + key);
    }
  }
};