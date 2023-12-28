import { Chart, ChartConfiguration, ChartData, ChartDataset, ChartOptions, ChartType, LegendItem, ScriptableLineSegmentContext, TooltipItem, registerables } from 'chart.js';

// Constants
const serverUrl = 'https://www.despair.services';

// Variables
var dataMin: number;
var dataMax: number;
var chartConfig: ChartConfiguration;

var enable: boolean;
var priceColor: string;
var gapColor: string;
var minimumColor: string;
var intermediateColor: string;
var maximumColor: string;

// Functions
function getUnityDisplay(): Element | null {
  return document.getElementsByClassName('_25Ksj')[0];
}

function display() {
  const chartElement = document.getElementById('price-history-chart');
  if (chartElement !== undefined && chartElement !== null) return;

  const unityDisplay = getUnityDisplay();
  if (unityDisplay === undefined || unityDisplay === null) throw Error('Error 5004');

  const unityDisplayParent = unityDisplay.parentNode;
  if (unityDisplayParent === undefined || unityDisplayParent === null) throw Error('Error 5005');

  const newChartElement = document.createElement('canvas');
  newChartElement.id = 'price-history-chart';
  newChartElement.className = unityDisplay.className;

  new Chart(newChartElement, chartConfig);

  unityDisplayParent.insertBefore(newChartElement, unityDisplay.nextSibling);
}

function segmentColor(ctx: ScriptableLineSegmentContext): string {
  if (ctx.p0.parsed.y === ctx.p1.parsed.y) {
    if (ctx.p0.parsed.y === dataMax && dataMax !== dataMin) {
      return maximumColor;
    } else if (ctx.p0.parsed.y === dataMin) {
      return minimumColor;
    } else {
      return intermediateColor;
    }
  } else {
    return gapColor;
  }
}

function segmentDash(ctx: ScriptableLineSegmentContext): any {
  if (ctx.p0.parsed.y === ctx.p1.parsed.y) {
    return undefined;
  } else {
    return [6, 6];
  }
}

function start() {
  const assetElement = document.getElementsByClassName('cfm2v')[0];
  if (assetElement === undefined || assetElement === null) throw Error('Error 5001');

  const assetName = assetElement.innerHTML;
  if (assetName === undefined || assetName === null) throw Error('Error 5002');

  const assetNameEncoded = encodeURI(assetName);
  if (assetNameEncoded === undefined || assetNameEncoded === null) throw Error('Error 5003');

  const request = { type: 'fetch', content: `${serverUrl}/api/unity-asset-store-price-tracker?name=${assetNameEncoded}` };
  chrome.runtime.sendMessage(request, response => {
    const ok = response.ok;
    const content = response.content;
    if (!ok) throw Error(content);

    const now = new Date();
    const nowParsed = now.toISOString().split('T')[0];

    content.push({ x: nowParsed, y: content[content.length - 1]['y'] });
    
    const chartLabels = [];
    for (let i = 0; i < content.length; i++) {
      chartLabels.push(content[i]['x']);
    }

    const dataFirst = content.map((o: any) => o['y']);
    dataMin = Math.min(...dataFirst);
    dataMax = Math.max(...dataFirst);

    var data = [];
    for (let i = 0; i < content.length; i++) {
      data.push(content[i]);
      if (i < content.length - 1) {
        var stepData = { x: content[i]['x'], y: content[i + 1]['y']};
        if (JSON.stringify(content[i]) !== JSON.stringify(stepData)) {
          data.push(stepData);
        }
      } 
    }

    const chartDatasets: ChartDataset[] = [
      {
        label: 'Price',
        data: data,
        borderColor: priceColor,
        stepped: true,
        segment: {
          borderColor: (ctx: ScriptableLineSegmentContext) => segmentColor(ctx),
          borderDash: (ctx: ScriptableLineSegmentContext) => segmentDash(ctx),
        },
      },
      {
        label: 'Gap',
        data: [],
        backgroundColor: gapColor,
        segment: {
          borderColor: gapColor,
        },
      },
      {
        label: 'Minimum',
        data: [],
        backgroundColor: minimumColor,
        segment: {
          borderColor: minimumColor,
        },
      },
      {
        label: 'Intermediate',
        data: [],
        backgroundColor: intermediateColor,
        segment: {
          borderColor: intermediateColor,
        },
      },
      {
        label: 'Maximum',
        data: [],
        backgroundColor: maximumColor,
        segment: {
          borderColor: maximumColor,
        },
      },
    ];

    const chartType: ChartType = 'line';

    const chartData: ChartData = {
      labels: chartLabels,
      datasets: chartDatasets,
    };

    const chartPlugins = {
      title: {
        display: true,
        text: 'Price History',
      },
      legend: {
        labels: {
          filter: (item: LegendItem, _data: ChartData) => !item.text.includes('Price') && !item.text.includes('Gap'),
        },
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<typeof chartType>) => context.dataset.label + ' $ ' + context.formattedValue,
        },
      },
      radius: 0,
    };

    const chartOptions: ChartOptions = {
      responsive: true,
      scales: {
        y: {
          min: 0,
          ticks: {
            callback: (tickValue, _index, _ticks) => '$ ' + tickValue,
          },
        },
      },
      plugins: chartPlugins,
    };

    chartConfig = {
      type: chartType,
      data: chartData,
      options: chartOptions,
    };
    
    setInterval(display, 500);
  });
}

async function init() {
  await chrome.storage.sync.get('enable').then((result) => enable = result['enable']);
  await chrome.storage.sync.get('priceColor').then((result) => priceColor = result['priceColor']);
  await chrome.storage.sync.get('gapColor').then((result) => gapColor = result['gapColor']);
  await chrome.storage.sync.get('minimumColor').then((result) => minimumColor = result['minimumColor']);
  await chrome.storage.sync.get('intermediateColor').then((result) => intermediateColor = result['intermediateColor']);
  await chrome.storage.sync.get('maximumColor').then((result) => maximumColor = result['maximumColor']);
}

// Entry Point
const entryPoint = async () => {
  Chart.register(...registerables);
  await init();
  if (enable) start();
};
entryPoint();
