module.exports = function(grunt){

	grunt.initConfig({
		jshint: {
			options: { esversion: 6 },
			all: ['Gruntfile.js', 'js/*.js']
		},
		sass: {
			dev: {
				options: {
					style: 'expanded'
				},
				files: {
					'css/main.css':'css/scss/main.scss',
					'css/landing.css':'css/scss/landing.scss',
					'css/login.css':'css/scss/login.scss'
				}
			}
		},
		watch: {
			js: {
				files: ['js/*.js'],
				tasks: ['jshint'],
				options: {
					livereload: true,
				}
			},
			css: {
				files: ['css/scss/*.scss'],
				tasks: ['sass:dev', 'concat:css'],
				options: {
					livereload: true
				}
			},
			html: {
				files: ['views/*.html', 'index.html'],
				options: {
					livereload: true
				}
			}
		},
		'notify_hooks': {
			options: {
				enabled: true,
				max_jshint_notifications: 5, // maximum number of notifications from jshint output
				success: false, // whether successful grunt executions should be notified automatically
				duration: 3 // the duration of notification in seconds, for `notify-send only
			}
		},
		concurrent :{
			options: {
				logConcurrentOutput: true
			},
			dev: {
				tasks: ['connect','watch']
			}
		},
		concat: {
    	css: {
				src: ['css/*.css'],
				dest: 'css/style.css'
			}
  	},
		connect: {
			keepalive : {
				options: {
					port: 80,
					host: "localhost",
					keepalive: true,
					open: "http://localhost:80/",
					livereload: true
				}
			}
		}
	});

	grunt.registerTask('default', ["concurrent:dev"]);
	grunt.registerTask('css', ["sass","concat"]);
	// grunt.registerTask('default', ['watch','notify_hooks', 'reload','http-server']);

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-notify');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-concat');

};
