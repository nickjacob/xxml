;(function (window, undefined) {
  // filewriterjs
  //  lets us write to a file; to use with the to_xml
  window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
  if (!window.requestFileSystem) return;

  var MIN_SIZE = 5 * 1024 * 1024, // 5 mb
      CREATE_OPTS = {
        create: true
      };

  function fs_success (fs) {
  }

  function fs_error (err) {
    throw err;
  }

  function requestFS (cb) {
    window.requestFileSystem(window.TEMPORARY, MIN_SIZE, cb, fs_error);
  }

  function FFile (_file) {
    this._file = _file;
    this.fs = _file.filesystem;
  }

  FFile.prototype = {
    read: function (cb) {
      var reader = new FileReader();
      reader.onloadend = function (e) {
        cb(this.result);
      };
      reader.readAsText(this._file);
    },
    write: function (data, cb) {
      this._file.createWriter(function (writer) {
        writer.onwriteend = function (e) {
          cb(null, writer);
        }

        writer.onerror = function (e) {
          cb(e, null);
        }

        var blob = new Blob([data.data], { type: data.type });
        writer.write(blob);
      });
    }
  }

  window.filesystem = window.filesystem || {};
  window.filesystem = {
    createFile: function (filename, cb) {
      requestFS(function (fs) {
        fs.root.getFile(filename, CREATE_OPTS, function (fd) {
          fd.file(function (f) {
            var ffile = new FFile(fd, f);
            cb(ffile, f, fs);
          });
        }, fs_error);
      });
    },
  }

}(window));
