module.exports = function (grunt) {

  var tcsBUhead    = '/* tcsBU 1.0.0 (nightly) (c)  amsantos@fc.up.pt */\n';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      tcsBU: [
         'js/tcsBU.js',
         'js/tcsBU.min.js',
         'css/tcsBU.css',
         'css/tcsBU.min.css',
      ]
    },
    concat: {
      tcsBU: {
        options: { 
                   banner: tcsBUhead + "\n;$(function () {\n'use strict';\n\n",
                   footer: "});\n" 
                 },
        src: [
          'src/global.js',
          'src/svgStart.js',
          'src/classify.js',
          'src/force.js',
          'src/loadGraph.js',
          'src/loadHaplotypes.js',
          'src/loadGroups.js',
          'src/createPattern.js',
          'src/saveHaplotypes.js',
          'src/saveGroups.js',
          'src/saveSVG.js',
          'src/saveExamples.js',
          'src/groups.js',
          'src/haplotypes.js',
          'src/layout.js',
          'src/legend.js',
          'src/insertLegend.js',
          'src/main.js'
        ],
        dest: 'js/tcsBU.js'
      },
      css: {
        options: { banner: tcsBUhead },
        src    : 'src/css/tcsBU.css',
        dest   : 'css/tcsBU.css'
      },
    },
    uglify: {
      tcsBU: { 
        options: { banner: tcsBUhead, mangling: false },
        files: {
          'js/tcsBU.min.js': 'js/tcsBU.js'
        }
      },
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1,
        banner: tcsBUhead
      },
      css: {
        files: {
          'css/tcsBU.min.css': 'src/css/tcsBU.css'
        }
      }
    },
    watch: {
      tcsBU : {
        files: ['src/*.js'],
        tasks: ['concat:tcsBU', 'uglify:tcsBU']
      },
      css : {
         files: ['src/css/*.css'],
         tasks: ['concat:css', 'cssmin:css']
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.registerTask('default', ['clean', 'concat', 'uglify', 'cssmin']);
  grunt.registerTask('tcsBU', ['clean:tcsBU', 'concat:tcsBU', 'uglify:tcsBU', 'concat:css', 'cssmin:css' ]);
};
