import {
  defineWidget,
  param,
  folder,
  when,
  type ExtractParams,
} from "@joymath/widget-sdk";

export const widgetDefinition = defineWidget({
  mode: param
    .select(["Simple", "Advanced"], "Simple")
    .label("Chế độ")
    .description("Simple: Cơ bản, Advanced: Nâng cao"),

  // Top-level parameters
  title: param
    .string("Tập trung nào!")
    .label("Tiêu đề")
    .description("Tiêu đề hiển thị phía trên đồng hồ"),

  duration: param.number(60).label("Thời gian (giây)").min(5).max(600).step(5),

  autoStart: param
    .boolean(false)
    .label("Tự động bắt đầu")
    .description("Bắt đầu đếm ngay khi load"),

  showMilliseconds: param
    .boolean(false)
    .label("Hiện mili giây")
    .visibleIf(when("mode").equals("Advanced")),

  // Appearance folder
  appearance: folder("Giao diện", {
    colors: folder("Màu sắc", {
      timerColor: param.color("#1f2937").label("Màu chữ đồng hồ"),
      backgroundColor: param.color("#ffffff").label("Màu nền"),
      buttonColor: param.color("#000000").label("Màu nút"),
    }),
    background: folder("Ảnh nền", {
      imageUrl: param
        .image("")
        .label("URL ảnh nền")
        .placeholder("https://example.com/image.jpg"),
      opacity: param.number(0.3).min(0).max(1).step(0.1).label("Độ mờ ảnh nền"),
    }),
    layout: folder("Bố cục", {
      fontSize: param.number(80).min(24).max(200).label("Cỡ chữ"),
      padding: param.number(16).min(0).max(64).label("Padding"),
    }),
  }).expanded(true),

  // Advanced folder - only visible when mode = "Advanced"
  advanced: folder("Nâng cao", {
    enableSound: param.boolean(false).label("Bật âm thanh"),
    completionMessage: param
      .string("⏰ Hết giờ!")
      .label("Thông báo hoàn thành"),
  })
    .expanded(false)
    .visibleIf(when("mode").equals("Advanced")),
} as const);

export type WidgetParams = ExtractParams<typeof widgetDefinition>;
