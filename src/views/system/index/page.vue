<template>
  <d2-container class="page">
    <d2-grid-layout v-bind="layout" @layout-updated="layoutUpdatedHandler">
      <d2-grid-item v-for="(item, index) in layout.layout" :key="index" v-bind="item" @resize="resizeHandler"
        @move="moveHandler" @resized="resizedHandler" @moved="movedHandler">
        <el-card shadow="never" class="page_card">
          <el-tag size="mini" type="info" slot="header">{{item.i}}</el-tag>
          <template v-if="item.i === '核查点'">
            <p><i>2</i>(个)</p>
          </template>
          <template v-if="item.i === '核查人员'">
            <p><i>2</i>(人)</p>
          </template>
          <template v-if="item.i === '台账记录'">
            <p><i>2</i>(条)</p>
          </template>
          <template v-if="item.i === '未整改'">
            <p><i>2</i>(个)</p>
          </template>
          <template v-if="item.i === '整改中'">
            <p><i>2</i>(个)</p>
          </template>
          <template v-if="item.i === '已整改'">
            <p><i>2</i>(个)</p>
          </template>
          <!-- 核查点统计 -->
          <template v-if="item.i === '核查点统计'">
              <div id="check-point-charts"></div>
          </template>
        </el-card>
      </d2-grid-item>
    </d2-grid-layout>
  </d2-container>
</template>

<script>
  import echarts from 'echarts' // 图表
  export default {
    data() {
      return {
        layout: {
          layout: [{
              'x': 0,
              'y': 0,
              'w': 2,
              'h': 5,
              'i': '核查点'
            },
            {
              'x': 2,
              'y': 0,
              'w': 2,
              'h': 5,
              'i': '核查人员'
            },
            {
              'x': 4,
              'y': 0,
              'w': 2,
              'h': 5,
              'i': '台账记录'
            },
            {
              'x': 6,
              'y': 0,
              'w': 2,
              'h': 5,
              'i': '未整改'
            },
            {
              'x': 8,
              'y': 0,
              'w': 2,
              'h': 5,
              'i': '整改中'
            },
            {
              'x': 10,
              'y': 0,
              'w': 2,
              'h': 5,
              'i': '已整改'
            },

            {
              'x': 0,
              'y': 5,
              'w': 6,
              'h': 10,
              'i': '核查点统计'
            },
            {
              'x': 6,
              'y': 5,
              'w': 6,
              'h': 10,
              'i': '核查点返工率统计'
            },
            {
              'x': 0,
              'y': 15,
              'w': 6,
              'h': 10,
              'i': '台账进度统计'
            },
            {
              'x': 6,
              'y': 15,
              'w': 6,
              'h': 10,
              'i': '问责情况统计'
            }
          ],
          colNum: 12,
          rowHeight: 30,
          isDraggable: true,
          isResizable: true,
          isMirrored: false,
          verticalCompact: true,
          margin: [10, 10],
          useCssTransforms: true
        }
      }
    },
    mounted() {
      // 加载完成后显示提示
      this.showInfo();
      this.checkPoint(); // 核查点分布统计
    },
    methods: {
      log(arg1 = 'log', ...logs) {
        if (logs.length === 0) {
          console.log(arg1)
        } else {
          console.group(arg1)
          logs.forEach(e => {
            console.log(e)
          })
          console.groupEnd()
        }
      },
      // 显示提示
      showInfo() {
        this.$notify({
          title: '提示',
          message: '你可以按住卡片拖拽改变位置；或者在每个卡片的右下角拖动，调整卡片大小'
        })
      },
      // 测试代码
      layoutUpdatedHandler(newLayout) {
        console.group('layoutUpdatedHandler')
        newLayout.forEach(e => {
          console.log(`{'x': ${e.x}, 'y': ${e.y}, 'w': ${e.w}, 'h': ${e.h}, 'i': '${e.i}'},`)
        })
        console.groupEnd()
      },
      resizeHandler(i, newH, newW) {
        this.log('resizeHandler', `i: ${i}, newH: ${newH}, newW: ${newW}`)
      },
      moveHandler(i, newX, newY) {
        this.log('moveHandler', `i: ${i}, newX: ${newX}, newY: ${newY}`)
      },
      resizedHandler(i, newH, newW, newHPx, newWPx) {
        this.log('resizedHandler', `i: ${i}, newH: ${newH}, newW: ${newW}, newHPx: ${newHPx}, newWPx: ${newWPx}`)
      },
      movedHandler(i, newX, newY) {
        this.log('movedHandler', `i: ${i}, newX: ${newX}, newY: ${newY}`)
      },
      // 核查点分布统计
      /* *
       *	myChart ---- 初始化好的echarts实例
       */
      checkPoint() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('check-point-charts'));
        // 绘制图表
        myChart.setOption({
          title: {
            text: '核查点分布统计',
            subtext: '', // 副标题
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: ""
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: [
              '天津古海岸与湿地国家级自然保护区(滨海新区)',
              '天津古海岸与湿地国家级自然保护区(津南区)',
              '天津古海岸与湿地国家级自然保护区(宝坻区)',
              '天津古海岸与湿地国家级自然保护区(宁河区)',
              '天津大黄堡湿地自然保护区',
              '天津青龙湾固沙林自然保护区',
              '北大港湿地自然保护区',
              '天津团泊鸟类自然保护区',
              '天津八仙山国家级自然保护区',
              '天津蓟县中上元古界国家自然保护区',
              '蓟县盘山自然风景名胜古迹保护区',

            ],
          },
          series: [{
            name: '',
            type: 'pie',
            radius: '55%',
            center: ['67%', '60%'],
            data: [{
                value: 3,
                name: '天津大黄堡湿地自然保护区'
              },
              {
                value: 3,
                name: '天津青龙湾固沙林自然保护区'
              },
              {
                value: 2,
                name: '北大港湿地自然保护区'
              },
              {
                value: 1,
                name: '天津古海岸与湿地国家级自然保护区(宁河区)'
              },
              {
                value: 2,
                name: '天津团泊鸟类自然保护区'
              },
              {
                value: 3,
                name: '天津八仙山国家级自然保护区'
              },
              {
                value: 14,
                name: '天津蓟县中上元古界国家自然保护区'
              },
              {
                value: 15,
                name: '蓟县盘山自然风景名胜古迹保护区'
              },
              {
                value: 10,
                name: '天津古海岸与湿地国家级自然保护区(滨海新区)'
              },
              {
                value: 13,
                name: '天津古海岸与湿地国家级自然保护区(津南区)'
              },
              {
                value: 18,
                name: '天津古海岸与湿地国家级自然保护区(宝坻区)'
              }
            ],
            label: {
              align: 'left',
              normal: {
                // 饼图文字折叠
                formatter(v) {
                  let text = Math.round(v.percent) + '%' + '' + v.name
                  if (text.length <= 8) {
                    return text;
                  } else if (text.length > 8 && text.length <= 16) {
                    return text = `${text.slice(0, 8)}\n${text.slice(8)}`
                  } else if (text.length > 16 && text.length <= 24) {
                    return text = `${text.slice(0, 8)}\n${text.slice(8, 16)}\n${text.slice(16)}`
                  } else if (text.length > 24 && text.length <= 30) {
                    return text =
                      `${text.slice(0, 8)}\n${text.slice(8, 16)}\n${text.slice(16, 24)}\n${text.slice(24)}`
                  } else if (text.length > 30) {
										return text = `${text.slice(0, 8)}\n${text.slice(8, 16)}\n${text.slice(16, 24)}\n${text.slice(24, 30)}\n${text.slice(30)}`
                  }
                }
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }

          }]
        })
        // 监听视窗大小
        window.addEventListener('resize', () => {
          myChart.resize()
        })
        // // 点击柱状图中某一项
        // myChart.on("click", param => {
        //   if (true) {
        //     console.log(param);
        //     this.checkPointDetail.checkPointName = param.name;
        //     this.checkPointDetail.checkPointNumber = param.value;
        //     this.checkPointDetail.title = '核查点数量'
        //     this.modal12 = true;
        //   }
        // })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page {
    .vue-grid-layout {
      background-color: $color-bg;
      border-radius: 4px;
      margin: -10px;

      .page_card {
        height: 100%;
        @extend %unable-select;
      }

      .vue-resizable-handle {
        opacity: .3;

        &:hover {
          opacity: 1;
        }
      }
    }
  }
</style>
