module.exports = function(grunt) {

  //Configure Grunt
  grunt.initConfig({

    //Point to the package file
    pkg: grunt.file.readJSON('package.json'),
    cssmin: {
      minify: {
        expand: true,
        cwd: '.',
        src: ['*.css', '!*.min.css'],
        dest: '.',
        ext: '.min.css'
      }
    }
  });

  //Load plug-ins
  grunt.loadNpmTasks('grunt-contrib-cssmin');


  grunt.registerTask('default', [
    'cssmin'
  ]);
};