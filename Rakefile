SRC = "src"
BUILD = "build"

p_cp = proc do |t|
  sh "cp #{t.prerequisites} #{t.name}"
end

rule ".html" => "%{^#{BUILD}/,#{SRC}/}X.haml" do |t|
  sh "haml -q #{t.prerequisites} #{t.name}"
end

rule ".png" => "#{SRC}/%{_\\d+x\\d+$,}n.svg" do |t|
  /_(\d+)x(\d+)\.png$/ =~ t.name
  sh "convert\
    -background transparent\
    -resize #{$1}x#{$2}\
    #{t.prerequisites} #{t.name}"
end

task :default => [
  BUILD,
  "#{BUILD}/manifest.json",
  "#{BUILD}/popup.html",
  "#{BUILD}/option.html",
  "#{BUILD}/icon_16x16.png",
  "#{BUILD}/icon_19x19.png",
  "#{BUILD}/icon_48x48.png",
  "#{BUILD}/icon_128x128.png",
]

task :clean do
  sh "rm -rf #{BUILD}"
end

directory BUILD
file "#{BUILD}/manifest.json" => "#{SRC}/manifest.json", &p_cp
