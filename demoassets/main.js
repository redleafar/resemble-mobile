$(function() {
    var files = ["https://i.ibb.co/W03KzNR/Screenshot-20191126-203245-Gnu-Cash-beta.jpg",
    "https://i.ibb.co/NyqJDsX/gnucash-modif.jpg",
    "https://i.ibb.co/QdK19hF/Screenshot-20191126-203253-Gnu-Cash-beta.jpg",
    "https://i.ibb.co/y039pz0/Screenshot-20191126-203253-Gnu-Cash-beta-modif.jpg"];
    console.log("start");
    
    manageImageAddition(0, files[0]); 

    function onComplete(data, row) {
        var time = Date.now();
        var diffImage = new Image();
        diffImage.src = data.getImageDataUrl();
            
        $("#image-diff" + row).html(diffImage);
        console.log("#image-diff" + row);
        console.log(row);        

        $(diffImage).click(function() {
            var w = window.open("about:blank", "_blank");
            var html = w.document.documentElement;
            var body = w.document.body;

            html.style.margin = 0;
            html.style.padding = 0;
            body.style.margin = 0;
            body.style.padding = 0;

            var img = w.document.createElement("img");
            img.src = diffImage.src;
            img.alt = "image diff";
            img.style.maxWidth = "100%";
            img.addEventListener("click", function() {
                this.style.maxWidth =
                    this.style.maxWidth === "100%" ? "" : "100%";
            });
            body.appendChild(img);
        });

        //$(".buttons").show();

        if (data.misMatchPercentage == 0) {
            $("#thesame" + row).show();
            $("#diff-results" + row).hide();            
        } else {
            $("#mismatch" + row).text(data.misMatchPercentage);
            if (!data.isSameDimensions) {
                $("#differentdimensions" + row).show();
            } else {
                $("#differentdimensions" + row).hide();
            }
            $("#diff-results" + row).show();
            $("#thesame" + row).hide();            
        }
    }    

    function manageImageAddition(position, file) {
        console.log("position:" + position);
        row = Math.floor(position / 2);
        if (position % 2 == 0) {
            $( "#main_row" ).append( $( "<div class=\"span4\"><div id=\"dropzone" + row + "1" + "\" class=\"small-drop-zone\">Imagen anterior</div></div>" ));
            $( "#main_row" ).append( $( "<div class=\"span4\"><div id=\"dropzone"+ row + "2" + "\" class=\"small-drop-zone\">Nueva imagen</div></div>" ));
            $( "#main_row" ).append( $( "<div class=\"span4\"><div id=\"image-diff"+ row + "\" class=\"small-drop-zone\">Diferencia.</div></div>" ));
            $( "#main_row" ).append( $( "<div class=\"row\"> <div class=\"span4 center-block\"><br/><br/><strong>Las imágenes tienen un <span id=\"mismatch" + row + "\"></span>% de diferencia.<span id=\"differentdimensions" + row + "\" style=\"display:none;\">Y tienen distintas dimensiones.</span></strong><p id=\"thesame" + row + "\" style=\"display:none;\"><strong>Las imágenes son iguales!</strong></p></div></div>" ));

            var newImage = new Image();            

            newImage.src = file;

            imageDiv = "#dropzone" + row + "1";
            $(imageDiv).html(newImage);            

            if (position<files.length-1) {                                
                manageImageAddition(position + 1, files[position + 1])                
            }
        }
        else {
            var newImage = new Image();            

            newImage.src = file;

            imageDiv = "#dropzone" + row + "2";
            $(imageDiv).html(newImage);            

            file2 = files[position - 1];

            var request = new XMLHttpRequest();
            request.open('GET', file, true);
            request.responseType = 'blob';            

            request.onload = function() {
                var reader = new FileReader();
                reader.readAsDataURL(request.response);                                
                
                reader.onload =  function(e1){                    
                    var request = new XMLHttpRequest();
                    request.open('GET', file2, true);
                    request.responseType = 'blob';  
                    console.log("file1 loaded");                  
                    
                    request.onload = function() {
                        var reader = new FileReader();
                        reader.readAsDataURL(request.response);                        
                        
                        reader.onload =  function(e2){
                            console.log("file2 loaded");
                            resembleControl = resemble(e1.target.result)
                                .compareTo(e2.target.result)
                                .onComplete(function(data) { 
                                    console.log("resemble oncomplete");
                                    onComplete(data, row);
                                    if (position<files.length-1) {                                
                                        manageImageAddition(position + 1 , files[position + 1])                
                                    }
                                }
                            )                                
                        };
                    };
                    request.send();
                };
            };
            request.send();            
        }
    }
});
