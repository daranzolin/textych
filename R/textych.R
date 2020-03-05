#' Create a textych
#'
#'
#' @param data A table of data
#' @param text Input column of words
#' @param text_index Variable to group text parallels by
#' @param color Variable that assigns a color to word
#' @param tooltip Variable specifying tooltip
#'
#' @import htmlwidgets
#' @importFrom rlang enquo quo_name get_expr
#'
#' @export
textych <- function(data, text = NULL, text_index = NULL, color = NULL, tooltip = NULL) {

  text <- enquo(text)
  text_index <- enquo(text_index)
  color <- enquo(color)
  tooltip <- enquo(tooltip)

  data_df <- as.data.frame(data)
  out_df <- data.frame(text = rep(NA, nrow(data_df)), stringsAsFactors = FALSE)
  out_df$word <- data_df[,quo_name(text)]
  out_df$ind <- data_df[,quo_name(text_index)]

  if (!is.null(get_expr(color))) {
    out_df$color <- data_df[,quo_name(color)]
  } else {
    out_df$color <- "#333333"
  }

  if (!is.null(get_expr(tooltip))) {
    out_df$tooltip <- data_df[,quo_name(tooltip)]
  } else {
    out_df$tooltip <- NULL
  }

  container_names <- unique(out_df$ind)
  container_seq <- 1:length(container_names)

  x = list(
    data = out_df,
    container_names = container_names,
    container_seq = container_seq
  )

  htmlwidgets::createWidget(
    name = 'textych',
    x,
    package = 'textych'
  )
}

#' Style a textych
#'
#' @param textych An object of class 'textych'
#' @param text_size Size of text in parallels
#' @param text_weight Font-weight of text in parallels
#' @param text_font Font of text in parallels
#' @param title_text_size Size of title text
#' @param title_text_weight Font-weight of title text
#' @param title_text_font Font of title text
#'
#' @return An object of class 'textych'
#' @export
tt_style <- function(textych,
                     text_size = 14,
                     text_weight = "normal",
                     text_font = "Arial",
                     title_text_size = 14,
                     title_text_weight = "bold",
                     title_text_font = "Arial") {

  textych$x$text_size = text_size
  textych$x$text_weight = text_weight
  textych$x$text_font = text_font
  textych$x$title_text_size = title_text_size
  textych$x$title_text_weight = title_text_weight
  textych$x$title_text_font = title_text_font
  return(textych)
}

#' Shiny bindings for textych
#'
#' Output and render functions for using textych within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a textych
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name textych-shiny
#'
#' @export
textychOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'textych', width, height, package = 'textych')
}

#' @rdname textych-shiny
#' @export
renderTextych <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, textychOutput, env, quoted = TRUE)
}
