<template>
  <div ref="mapContainer" :style="{ width: props.width, height: props.height }"></div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';

let map = null;
let geocoder = null;
const mapContainer = ref();

const props = defineProps<{ address: string; width: string; height: string }>();
const emits = defineEmits(['setPoint']);

onMounted(async () => {
  await nextTick();
  initMap();
});

watch(props, (props) => {
  geocodeAddress(props.address);
})

const initMap = async () => {
  // 动态加载百度地图 API
  // await loadScript();
  map = new BMap.Map(mapContainer.value);
  geocoder = new BMap.Geocoder();

  // 初始化地图中心点（可选，因为后续会通过地址来设置）
  map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);

  // 使用地址进行标注
  geocodeAddress(props.address);
};
const geocodeAddress = (address: string) => {
  geocoder.getPoint(
    address,
    (point) => {
      if (point) {
        map.centerAndZoom(point, 15);
        const marker = new BMap.Marker(point);
        map.addOverlay(marker);

        // 可选：添加信息窗口
        const infoWindow = new BMap.InfoWindow(address);
        marker.addEventListener('click', () => {
          map.openInfoWindow(infoWindow, point);
        });

        // 向父组件传值，经纬度 {lat: number; lng: number}
        emits('setPoint', point);
      } else {
        console.error('地址未找到');
      }
    },
    '北京市'
  );
};
</script>
