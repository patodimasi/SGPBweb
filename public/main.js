/*const fs = require('fs');
const _ = require('lodash');
const path = require('path');

let dir ;
let include;
let exclude;

// default configuration
let config = {
    removeLockString: false,
    otherRoots: []
};

exports.moduleroot = __dirname;

exports.setcwd = function(cwd, inc, exc) {
   dir = cwd;
 
    include = inc;
    exclude = exc;
}


function displayFiles(files, currentDir, query) {
    let data = [];
    
    files.forEach(function (file) {
      //  console.log(query);
        let isDirectory =
            fs.statSync(path.join(currentDir, file)).isDirectory();
           
        if (isDirectory) {
            
            data.push({
                Name : file,
                IsDirectory: true,
                Path : path.join(query, file)
                
            });
        } else {
            let ext = path.extname(file);
           // console.log(ext);
            if(exclude && _.contains(exclude, ext)) {
                return;
            } else if(include && !_.contains(include, ext)) {
                return;
            }
            let filestr;
            if (config.removeLockString) {
                filestr = file.replace('.lock','');
            } else {
                filestr = file;
            }
            let rstr = '';
            if (currentDir !== dir) {
                rstr = currentDir;
            }
            data.push({
                Name : filestr,
                Ext : ext,
                IsDirectory: false,
                Path : path.join(query, file),
                Root : rstr
            });
        }
    });
    return data;
}

function readRoots(roots, res, query, fullList) {
    
    let currentDir = roots.shift();

    fs.readdir(currentDir, function (err, files) {
        let data;
        if (err) {
            // ignore non-readable directories
            data = fullList;
        } else {
            data = fullList.concat(displayFiles(files, currentDir, query));
        }

        if (roots.length > 0) {
            // loop to the next element
            readRoots(roots, res, query, data);
        } else {
            res.json(_.sortBy(data, function(f) { return f.Name }));
        }
    });

}

exports.get = function(req, res) {
    //console.log(dir);
   // let currentDir =  dir;
    
    let currentDir = 'C:\\Users\\PatriciaDimasi\\Desktop';
    
    dir = currentDir;
    //console.log(currentDir);
   // console.log(currentDir);
    let query = req.query.path || '';
    let roots = [];
    console.log(query);
    if (query) {
       
        roots.push(path.join(dir, query));
    } else {
       
        // top level, add all roots
        roots = config.otherRoots.slice();
        roots.push(currentDir);
    }
    readRoots(roots, res, query, []);
};

/*jQuery(function ($) {

    // Dropdown menu
    $(".sidebar-dropdown > a").click(function () {
        $(".sidebar-submenu").slideUp(200);
        if ($(this).parent().hasClass("active")) {
            $(".sidebar-dropdown").removeClass("active");
            $(this).parent().removeClass("active");
        } else {
            $(".sidebar-dropdown").removeClass("active");
            $(this).next(".sidebar-submenu").slideDown(200);
            $(this).parent().addClass("active");
        }

    });

    //toggle sidebar
    $("#toggle-sidebar").click(function () {
        $(".page-wrapper").toggleClass("toggled");
    });
    //Pin sidebar
    $("#pin-sidebar").click(function () {
        if ($(".page-wrapper").hasClass("pinned")) {
            // unpin sidebar when hovered
            $(".page-wrapper").removeClass("pinned");
            $("#sidebar").unbind( "hover");
        } else {
            $(".page-wrapper").addClass("pinned");
            $("#sidebar").hover(
                function () {
                    console.log("mouseenter");
                    $(".page-wrapper").addClass("sidebar-hovered");
                },
                function () {
                    console.log("mouseout");
                    $(".page-wrapper").removeClass("sidebar-hovered");
                }
            )

        }
    });


    //toggle sidebar overlay
    $("#overlay").click(function () {
        $(".page-wrapper").toggleClass("toggled");
    });

    //switch between themes 
    var themes = "default-theme legacy-theme chiller-theme ice-theme cool-theme light-theme";
    $('[data-theme]').click(function () {
        $('[data-theme]').removeClass("selected");
        $(this).addClass("selected");
        $('.page-wrapper').removeClass(themes);
        $('.page-wrapper').addClass($(this).attr('data-theme'));
    });

    // switch between background images
    var bgs = "bg1 bg2 bg3 bg4";
    $('[data-bg]').click(function () {
        $('[data-bg]').removeClass("selected");
        $(this).addClass("selected");
        $('.page-wrapper').removeClass(bgs);
        $('.page-wrapper').addClass($(this).attr('data-bg'));
    });

    // toggle background image
    $("#toggle-bg").change(function (e) {
        e.preventDefault();
        $('.page-wrapper').toggleClass("sidebar-bg");
    });

    // toggle border radius
    $("#toggle-border-radius").change(function (e) {
        e.preventDefault();
        $('.page-wrapper').toggleClass("boder-radius-on");
    });

    //custom scroll bar is only used on desktop
    if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $(".sidebar-content").mCustomScrollbar({
            axis: "y",
            autoHideScrollbar: true,
            scrollInertia: 300
        });
        $(".sidebar-content").addClass("desktop");

    }
    
});
*/