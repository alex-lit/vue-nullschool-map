<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  type Height =
    | 'surface/level'
    | 'isobaric/1000hPa'
    | 'isobaric/850hPa'
    | 'isobaric/700hPa'
    | 'isobaric/500hPa'
    | 'isobaric/250hPa'
    | 'isobaric/70hPa'
    | 'isobaric/10hPa';

  type Overlay =
    | ''
    | 'overlay=temp'
    | 'overlay=relative_humidity'
    | 'overlay=wind_power_density'
    | 'overlay=precip_3hr'
    | 'overlay=cape'
    | 'overlay=total_precipitable_water'
    | 'overlay=total_cloud_water'
    | 'overlay=mean_sea_level_pressure'
    | 'overlay=misery_index'
    | 'overlay=off';

  type Projection =
    | 'atlantis'
    | 'azimuthal_equidistant'
    | 'conic_equidistant'
    | 'equirectangular'
    | 'orthographic'
    | 'patterson'
    | 'stereographic'
    | 'waterman'
    | 'winkel3';

  @Component<VueNullscoolMap>({})
  export default class VueNullscoolMap extends Vue {
    showFrame: boolean = true;

    @Prop({ type: String, default: 'surface/level' })
    height!: Height;

    @Prop({ type: String, default: '' })
    overlay!: Overlay;

    @Prop({ type: String, default: 'orthographic' })
    projection!: Projection;

    @Prop({
      type: Number,
      default: 0,
      validator(value) {
        return value >= -360 && value <= 360;
      },
    })
    longitude!: number;

    @Prop({
      type: Number,
      default: 0,
      validator(value) {
        return value >= -360 && value <= 360;
      },
    })
    latitude!: number;

    @Prop({
      type: Number,
      default: null,
      validator(value) {
        return value >= 0 && value <= 3000;
      },
    })
    zoom!: number | null;

    mounted() {
      // eslint-disable-next-line no-unused-expressions
      window?.addEventListener('resize', () => {
        this.showFrame = false;
        setTimeout(() => {
          this.showFrame = true;
        }, 0);
      });
    }
  }
</script>

<template>
  <div class="vue-nullscool-map">
    <transition name="el-fade-in">
      <iframe
        v-if="showFrame"
        class="vue-nullscool-map__frame"
        :src="
          `//earth.nullschool.net#current/wind/${height}${
            overlay ? `/${overlay}` : ''
          }/${projection}=${longitude},${latitude},${zoom}`
        "
      >
      </iframe>
    </transition>
  </div>
</template>

<style lang="postcss" scoped>
  .vue-nullscool-map {
    position: relative;
    width: 100%;
    height: 100%;
    /* stylelint-disable */
    background-color: #000005;
  }

  .vue-nullscool-map__frame {
    width: 100%;
    height: 100%;
    border: none;
  }
</style>

<style lang="postcss">
  #earth {
    opacity: 0.1;
  }
</style>
