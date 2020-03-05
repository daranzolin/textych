HTMLWidgets.widget({

  name: 'textych',

  type: 'output',

  factory: function(el, width, height) {

    return {

      renderValue: function(opts) {

        let data = HTMLWidgets.dataframeToD3(opts.data);
        //console.log(data);
        const svg = d3.select(el)
                    .append("svg")
                    .style("width", "100%")
                    .style("height", "100%");

        let margin = ({top: 30, right: 25, bottom: 20, left: 25});
        let filtered_data;
        let a;
        let value;
        let tooltip_toggle;
        let containers = opts.container_names.length;
        let drawspace = width - (margin.left + margin.right);
        let drawspacePerContainer = drawspace/containers;
        let text_font = opts.hasOwnProperty("text_font") ? opts.text_font : "Arial";
        let text_size = opts.hasOwnProperty("text_size") ? opts.text_size : "14";
        let text_weight = opts.hasOwnProperty("text_weight") ? opts.text_weight : "normal";
        let title_text_font = opts.hasOwnProperty("title_text_font") ? opts.title_text_font : "Arial";
        let title_text_size = opts.hasOwnProperty("title_text_size") ? opts.title_text_size : "14";
        let title_text_weight = opts.hasOwnProperty("title_text_weight") ? opts.title_text_weight : "bold";

        let lineData = d3.range(containers - 1).map(x => x + 1).map((d, i) => {
            let obj = {};
            obj.x = drawspacePerContainer * d;
            return obj;
        });

        let x = d3.scaleBand()
                  .domain(opts.container_names)
                  .range([margin.left, width - margin.right])
                  .paddingInner(0.05);

        svg.selectAll("text")
            .data(opts.container_names)
            .enter().append("text")
            .attr("x", (d, i) => x(d) + ((i+1)*10))
            .attr("y", 15)
            .style("font", `${title_text_weight} ${title_text_size}px ${title_text_font}`)
            .text(d => d);

        svg.selectAll("line")
            .data(lineData)
            .enter().append("line")
            .attr("x1", (d, i) => d.x + ((i+1) *10))
            .attr("y1", margin.top*1.5)
            .attr("x2", (d, i) => d.x + ((i+1) *10))
            .attr("y2", height - (margin.bottom*3))
            //.attr("stroke-width", 2)
            .attr("stroke", "black");

        for (let i = 0; i < opts.container_names.length; i++) {
          	a = svg.append("foreignObject")
            .attr("width", (width/containers) - 20)
            .attr("height", height)
            .attr("x", (i * width/containers))
            .attr("y", margin.top)
            .append("xhtml:body")
            .attr('id', `foreignBody${i}`)
            .attr("class", "textContainer")
            .style("padding-left", "15px")
            .style("font", `${text_weight}  ${text_size}px ${text_font}`);

            filtered_data = data.filter(d => d.ind === opts.container_names[i]);
            for (let j = 0; j < filtered_data.length; j++) {
                value = document.getElementById(`foreignBody${i}`).innerHTML;
                tooltip_toggle = filtered_data[j].tooltip === null ? "tthidden" : "ttvisible";
                if (value) {
                    a.html(`${value} <span class="tooltip" style="color: ${filtered_data[j].color}">${filtered_data[j].word}
                    <span id=${tooltip_toggle} class="tooltiptext">${filtered_data[j].tooltip}</span></span>`);
                } else {
                    a.html(`<span class="tooltip" style="color: ${filtered_data[j].color}">${filtered_data[j].word}
                    <span id=${tooltip_toggle} class="tooltiptext">${filtered_data[j].tooltip}</span></span>`);
                }
            }
        }
      },

      resize: function(width, height) {

        // TODO: code to re-render the widget with a new size

      }

    };
  }
});
