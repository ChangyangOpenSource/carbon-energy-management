
export const eachar = {
    data() {
        return {
            listBar: {
                color: [{
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: '#03DFFC' // 0% 处的颜色
                    }, {
                        offset: 1, color: '#0E5FFF' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                },
                // 径向渐变，前三个参数分别是圆心 x, y 和半径，取值同线性渐变
                {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'rgba(255, 255, 255, 1) ' // 0% 处的颜色
                    }, {
                        offset: 1, color: 'rgba(195, 221, 224, 0.32)' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                }],
                legend: {
                    bottom: '2%',
                    textStyle: {
                        color: '#fff' // 设置字体颜色为红色
                    },
                    itemGap: 37
                },
                grid: {
                    top: '10%',
                    left: '3%',
                    right: '4%',
                    bottom: '15%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: {
                    type: 'value',
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: 'dashed',
                            color: ['rgba(0, 95, 83, 1)']
                        },
                    }
                },

                series: [
                    {
                        name: '电',
                        data: [],
                        type: 'bar'
                    },
                    {
                        name: '天然气',
                        data: [],
                        type: 'bar'
                    },

                ]
            },
            listPar: {
                color: [{
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: '#03DFFC' // 0% 处的颜色
                    }, {
                        offset: 1, color: '#0E5FFF' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                },
                // 径向渐变，前三个参数分别是圆心 x, y 和半径，取值同线性渐变
                {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'rgba(255, 255, 255, 1)' // 0% 处的颜色
                    }, {
                        offset: 1, color: 'rgba(195, 221, 224, 0.32)' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                }],
                title: [{
                    text: "总能耗分析",
                    left: 0,
                    top: '0%',
                    textStyle: {
                        fontSize: 16,
                        color: '#fff',

                    },

                }, {
                    text: "折标煤(t)",
                    left: 90,
                    top: '0%',

                    textStyle: {
                        fontSize: 14,
                        color: 'rgba(255, 255, 255, 0.7)',

                    }
                }],

                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    bottom: '2%',
                    textStyle: {
                        color: '#fff' // 设置字体颜色为红色
                    },
                    itemGap: 37
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['40%', '70%'],
                        data: [
                            // { value: 1048, name: '电' },
                            // { value: 735, name: '天然气' },
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        label: {
                            show: true,
                            position: 'outside',
                            formatter: '{@[1]}',
                            textStyle: {
                                fontSize: 14,
                                color: '#Fff'
                            },

                        },
                    }
                ]
            },
            photovoltaicBar: {
                color: [{
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: '#03DFFC' // 0% 处的颜色
                    }, {
                        offset: 1, color: '#0E5FFF' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                }],
                legend: {
                    right: '5%',
                    textStyle: {
                        color: '#fff' // 设置字体颜色为红色
                    },
                    itemGap: 37
                },
                grid: {
                    top: '15%',
                    left: '3%',
                    right: '4%',
                    bottom: '0%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu',],
                    
                },
                yAxis: {
                    type: 'value',
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: 'dashed',
                            color: ['rgba(0, 95, 83, 1)']
                        },
                    }
                },

                series: [
                    {
                        name: '电',
                        data: [120, 200, 150, 80, 70, 110, 130],
                        type: 'bar',
                        barWidth: '20%' // 设置柱状图的宽度为20%
                    },

                ]
            },
            carbonline: {
                color: ["#0AA7FF"],
                title: [{
                    text: "单位：tCO2",
                    left: 0,
                    top: '5%',
                    textStyle: {
                        fontSize: 14,
                        color: '#A2B0B8',

                    },
                }],

                grid: {
                    top: '20%',
                    left: '3%',
                    right: '4%',
                    bottom: '0%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu',]
                },
                yAxis: {
                    type: 'value',
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: 'dashed',
                            color: ['rgba(0, 95, 83, 1)']
                        },
                    }

                },

                series: [
                    {
                        data: [120, 200, 150, 80, 70, 110, 130],
                        type: 'line'
                    },

                ]
            },

            energyline: {
                color: ["#0AA7FF"],
                title: [],
                
                legend: {
                    right:'10',
                    textStyle: {
                        color: "#fff"
                    },
                    itemStyle: {
                        color: '#0A8CFE'
                      }
                },
                grid: {
                    top: '20%',
                    left: '3%',
                    right: '0%',
                    bottom: '0%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: {
                    type: 'value',
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: 'dashed',
                            color: ['rgba(0, 95, 83, 1)']
                        },
                    }

                },

                series: [
                    {
                        data: [],
                        type: 'line'
                    },
                    {
                        data: [],
                        type: 'line'
                    },

                ]
            },
            energyline2: {
                color: ["#0AA7FF"],
                title: [],
                
                legend: {
                    right:'10',
                    textStyle: {
                        color: "#fff"
                    },
                    itemStyle: {
                        color: '#0A8CFE'
                      }
                },
                grid: {
                    top: '20%',
                    left: '3%',
                    right: '0%',
                    bottom: '0%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: {
                    type: 'value',
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: 'dashed',
                            color: ['rgba(0, 95, 83, 1)']
                        },
                    }

                },

                series: [
                    {
                        data: [],
                        type: 'line'
                    },
                    {
                        data: [],
                        type: 'line'
                    },
                   
                ]
            },
            deiviceline:{
                color: [ "#0AA7FF","#00FFE0"],
                title: [],
                tooltip: {
                    trigger: "axis",
                  },
                legend: {
                    right:'10',
                    textStyle: {
                        color: "#fff"
                    },
                    itemStyle: {
                        color: '#0A8CFE'
                      }
                },
                grid: {
                    top: '20%',
                    left: '3%',
                    right: '0%',
                    bottom: '0%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: {
                    type: 'value',
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: 'dashed',
                            color: ['rgba(0, 95, 83, 1)']
                        },
                    }

                },

                series: [
                    { name:'当日',
                        data: [],
                        type: 'line'
                    },
                    {name:'前一日',
                        data: [],
                        type: 'line'
                    },

                ]
            },
            powerline:{
                color: [ "#0AA7FF","#00FFE0"],
                title: [],
                tooltip: {
                    trigger: "axis",
                 },
                legend: {
                    right:'10',
                    textStyle: {
                        color: "#fff"
                    },
                    itemStyle: {
                        color: '#0A8CFE'
                      }
                },
                grid: {
                    top: '20%',
                    left: '3%',
                    right: '0%',
                    bottom: '0%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: {
                    type: 'value',
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: 'dashed',
                            color: ['rgba(0, 95, 83, 1)']
                        },
                    }

                },

                series: [
                    { name:'有功',
                        data: [],
                        type: 'line'
                    },
                    {name:'无功',
                        data: [],
                        type: 'line'
                    },

                ]
            }
        }
    }
}