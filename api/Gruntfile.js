module.exports = function(grunt){

	grunt.initConfig({
	  pkg: grunt.file.readJSON('package.json'),
		jshint: {
      options: { esversion: 6 },
			all: ['Gruntfile.js', 'js/*.js']
		},
		watch: {
      options: {
        livereload: true
      },
			js: {
				files: ['lib/*.js','*.js','models/*.js','routes/*js'],
				tasks: ['jshint', 'express:dev'],
				options: {
					spawn: false,
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
    express: {
      options: {
        background: false
      },
      dev: {
        options: {
          script: './server.js'
        }
      }
    },
    concurrent :{
			options: {
				logConcurrentOutput: true
			},
			dev: {
				tasks: ['express','watch','notify_hooks']
			}
		}
	});

	grunt.registerTask('default', ['concurrent:dev']);

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-concurrent');

};
