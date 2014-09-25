(function () {
    window.app = {
        Views: {},
        Extensions: {},
        Router: null,
        init: function () {
            this.instance = new app.Views.App();
            Backbone.history.start();
        }
    };
    app.Router = Backbone.Router.extend({
        routes: {
          'new' : 'new',
          'lists' : 'lists',
          'restaurants' : 'restaurants',
          'settings' : 'settings',
          '': 'home'
        },
        home: function () {
            var view = new app.Views.Home();
            app.instance.goto(view);
        },
        new: function () {
            var view = new app.Views.New();
            app.instance.goto(view);
        },
        lists: function () {
            var view = new app.Views.Lists();
            app.instance.goto(view);
        },
        restaurants: function () {
            var view = new app.Views.Restaurants();
            app.instance.goto(view);
        },
        settings: function () {
            var view = new app.Views.Settings();
            app.instance.goto(view);
        }

    });
    app.Extensions.View = Backbone.View.extend({
        initialize: function () {
            this.router = new app.Router();
        },
        render: function(options) {
            options = options || {};
            if (options.page === true) {
              this.$el.addClass('page');
            }
            return this;
        },
        transitionIn: function (callback) {
            var view = this,delay;
            var transitionIn = function () {
                view.$el.addClass('is-visible');
                    view.$el.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                        if (_.isFunction(callback)) {
                            callback();
                        }
                    });
                }
            _.delay(transitionIn, 20);
        },
        transitionOut: function (callback) {
            var view = this;
            view.$el.removeClass('is-visible');
            view.$el.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                if (_.isFunction(callback)) {
                    callback();
                };
            });
        }
    });

    app.Views.App = app.Extensions.View.extend({
        el: 'main',
        goto: function (view) {
            var previous = this.currentPage || null;
            var next = view;
            if(!Modernizr.cssanimations) {
                if (previous) {
                    previous.remove();
                }
                next.render({ page: true });
                this.$el.append( next.$el );
            }else{
                if (previous) {
                    previous.transitionOut(function () {
                        previous.remove();
                    });
                }
                next.render({ page: true });
                this.$el.append( next.$el );
                next.transitionIn();
            }
            this.currentPage = next;
        }
    });

    app.Views.Home = app.Extensions.View.extend({
        className: '',
        render: function () {
            var template = _.template($('script[name=home]').html());
            this.$el.html(template());
            return app.Extensions.View.prototype.render.apply(this, arguments);
        }
    });
    app.Views.New = app.Extensions.View.extend({
        className: '',
        render: function () {
            var template = _.template($('script[name=new]').html());
            this.$el.html(template());
            return app.Extensions.View.prototype.render.apply(this, arguments);
        }
    });
    app.Views.Lists = app.Extensions.View.extend({
        className: '',
        render: function () {
            var template = _.template($('script[name=lists]').html());
            this.$el.html(template());
            return app.Extensions.View.prototype.render.apply(this, arguments);
        }
    });
    app.Views.Restaurants = app.Extensions.View.extend({
        className: '',
        render: function () {
            var template = _.template($('script[name=restaurants]').html());
            this.$el.html(template());
            return app.Extensions.View.prototype.render.apply(this, arguments);
        }
    });
    app.Views.Settings = app.Extensions.View.extend({
        className: '',
        render: function () {
            var template = _.template($('script[name=settings]').html());
            this.$el.html(template());
            return app.Extensions.View.prototype.render.apply(this, arguments);
        }
    });
}());
$(function () {
    window.app.init();
    
    // DB
    var db = new PouchDB('sushi_order_list', {adapter : 'websql'});
    db.put({
        title: 'Heroes'
    }, 'doc', function(err, response) { });
    db.get('doc', function(err, doc) {
        $('body').append(doc.title);
    });
    
    // SELECTORS
    $('#top_menu').click(function(){
        $('header').toggleClass('active');
    });
});