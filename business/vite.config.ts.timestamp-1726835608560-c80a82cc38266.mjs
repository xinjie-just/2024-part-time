// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import Components from "file:///D:/part-time-job/2024-part-time/business/node_modules/.pnpm/unplugin-vue-components@0.27.2_@babel+parser@7.24.7_rollup@4.18.0_vue@3.4.31_typescript@5.4.5_/node_modules/unplugin-vue-components/dist/vite.js";
import { AntDesignVueResolver } from "file:///D:/part-time-job/2024-part-time/business/node_modules/.pnpm/unplugin-vue-components@0.27.2_@babel+parser@7.24.7_rollup@4.18.0_vue@3.4.31_typescript@5.4.5_/node_modules/unplugin-vue-components/dist/resolvers.js";
import vue from "file:///D:/part-time-job/2024-part-time/business/node_modules/.pnpm/@vitejs+plugin-vue@5.0.5_vite@5.3.2_@types+node@20.14.9_sass@1.77.6__vue@3.4.31_typescript@5.4.5_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { loadEnv } from "file:///D:/part-time-job/2024-part-time/business/node_modules/.pnpm/vite@5.3.2_@types+node@20.14.9_sass@1.77.6/node_modules/vite/dist/node/index.js";
var __vite_injected_original_import_meta_url = "file:///D:/part-time-job/2024-part-time/business/vite.config.ts";
var CWD = process.cwd();
var vite_config_default = ({ command, mode }) => {
  const { VITE_BASE_URL } = loadEnv(mode, CWD);
  const isBuild = command === "build";
  console.log("isBuild", isBuild);
  return {
    base: VITE_BASE_URL,
    //  开发或生产环境服务的公共基础路径：默认'/'
    esbuild: {
      // target: 'es2015'
    },
    plugins: [
      vue(),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: false
            // css in js
          })
        ]
      })
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
      }
    },
    /* 开发服务器选项 */
    server: {
      port: 5173,
      // 指定开发服务器端口。注意：如果端口已经被使用，Vite 会自动尝试下一个可用的端口，所以这可能不是开发服务器最终监听的实际端口。
      host: "0.0.0.0",
      // 指定服务器应该监听哪个 IP 地址，设置为 0.0.0.0 或者 true 将监听所有地址，包括局域网和公网地址。
      cors: true,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      proxy: {
        // 为开发服务器配置自定义代理规则。
        "/api": {
          // target: 'https://www.00goo.com/manage', // 测试环境
          target: "https://7b85b77c.r27.cpolar.top/manage",
          // 徐仙本地环境
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "")
        }
      }
    }
  };
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxwYXJ0LXRpbWUtam9iXFxcXDIwMjQtcGFydC10aW1lXFxcXGJ1c2luZXNzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxwYXJ0LXRpbWUtam9iXFxcXDIwMjQtcGFydC10aW1lXFxcXGJ1c2luZXNzXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9wYXJ0LXRpbWUtam9iLzIwMjQtcGFydC10aW1lL2J1c2luZXNzL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnO1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSc7XG5pbXBvcnQgeyBBbnREZXNpZ25WdWVSZXNvbHZlciB9IGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVycyc7XG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSc7XG5pbXBvcnQgeyB0eXBlIFVzZXJDb25maWcsIHR5cGUgQ29uZmlnRW52LCBsb2FkRW52IH0gZnJvbSAndml0ZSc7XG5cbmNvbnN0IENXRCA9IHByb2Nlc3MuY3dkKCk7IC8vIFx1OTg3OVx1NzZFRVx1NjgzOVx1NzZFRVx1NUY1NVx1RkYwOGluZGV4Lmh0bWwgXHU2NTg3XHU0RUY2XHU2MjQwXHU1NzI4XHU3Njg0XHU0RjREXHU3RjZFXHVGRjA5XHUzMDAyXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCAoeyBjb21tYW5kLCBtb2RlIH06IENvbmZpZ0Vudik6IFVzZXJDb25maWcgPT4ge1xuICAvLyBcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcbiAgLy8gY29uc3QgeyBWSVRFX0JBU0VfVVJMLCBWSVRFX0RST1BfQ09OU09MRSB9ID0gbG9hZEVudihtb2RlLCBDV0QpO1xuICBjb25zdCB7IFZJVEVfQkFTRV9VUkwgfSA9IGxvYWRFbnYobW9kZSwgQ1dEKTtcblxuICAvLyBcdTU3MjhcdTVGMDBcdTUzRDFcdTczQUZcdTU4ODNcdTRFMEIgY29tbWFuZCBcdTc2ODRcdTUwM0NcdTRFM0Egc2VydmVcdUZGMDhcdTU3MjggQ0xJIFx1NEUyRFx1RkYwQyB2aXRlIGRldiBcdTU0OEMgdml0ZSBzZXJ2ZSBcdTY2MkYgdml0ZSBcdTc2ODRcdTUyMkJcdTU0MERcdUZGMDlcdUZGMENcdTgwMENcdTU3MjhcdTc1MUZcdTRFQTdcdTczQUZcdTU4ODNcdTRFMEJcdTRFM0EgYnVpbGRcdUZGMDh2aXRlIGJ1aWxkXHVGRjA5XG4gIGNvbnN0IGlzQnVpbGQgPSBjb21tYW5kID09PSAnYnVpbGQnO1xuICBjb25zb2xlLmxvZygnaXNCdWlsZCcsIGlzQnVpbGQpO1xuXG4gIHJldHVybiB7XG4gICAgYmFzZTogVklURV9CQVNFX1VSTCwgLy8gIFx1NUYwMFx1NTNEMVx1NjIxNlx1NzUxRlx1NEVBN1x1NzNBRlx1NTg4M1x1NjcwRFx1NTJBMVx1NzY4NFx1NTE2Q1x1NTE3MVx1NTdGQVx1Nzg0MFx1OERFRlx1NUY4NFx1RkYxQVx1OUVEOFx1OEJBNCcvJ1xuICAgIGVzYnVpbGQ6IHtcbiAgICAgIC8vIHRhcmdldDogJ2VzMjAxNSdcbiAgICB9LFxuICAgIHBsdWdpbnM6IFtcbiAgICAgIHZ1ZSgpLFxuICAgICAgQ29tcG9uZW50cyh7XG4gICAgICAgIHJlc29sdmVyczogW1xuICAgICAgICAgIEFudERlc2lnblZ1ZVJlc29sdmVyKHtcbiAgICAgICAgICAgIGltcG9ydFN0eWxlOiBmYWxzZSAvLyBjc3MgaW4ganNcbiAgICAgICAgICB9KVxuICAgICAgICBdXG4gICAgICB9KVxuICAgIF0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSlcbiAgICAgIH1cbiAgICB9LFxuICAgIC8qIFx1NUYwMFx1NTNEMVx1NjcwRFx1NTJBMVx1NTY2OFx1OTAwOVx1OTg3OSAqL1xuICAgIHNlcnZlcjoge1xuICAgICAgcG9ydDogNTE3MywgLy8gXHU2MzA3XHU1QjlBXHU1RjAwXHU1M0QxXHU2NzBEXHU1MkExXHU1NjY4XHU3QUVGXHU1M0UzXHUzMDAyXHU2Q0U4XHU2MTBGXHVGRjFBXHU1OTgyXHU2NzlDXHU3QUVGXHU1M0UzXHU1REYyXHU3RUNGXHU4OEFCXHU0RjdGXHU3NTI4XHVGRjBDVml0ZSBcdTRGMUFcdTgxRUFcdTUyQThcdTVDMURcdThCRDVcdTRFMEJcdTRFMDBcdTRFMkFcdTUzRUZcdTc1MjhcdTc2ODRcdTdBRUZcdTUzRTNcdUZGMENcdTYyNDBcdTRFRTVcdThGRDlcdTUzRUZcdTgwRkRcdTRFMERcdTY2MkZcdTVGMDBcdTUzRDFcdTY3MERcdTUyQTFcdTU2NjhcdTY3MDBcdTdFQzhcdTc2RDFcdTU0MkNcdTc2ODRcdTVCOUVcdTk2NDVcdTdBRUZcdTUzRTNcdTMwMDJcbiAgICAgIGhvc3Q6ICcwLjAuMC4wJywgLy8gXHU2MzA3XHU1QjlBXHU2NzBEXHU1MkExXHU1NjY4XHU1RTk0XHU4QkU1XHU3NkQxXHU1NDJDXHU1NEVBXHU0RTJBIElQIFx1NTczMFx1NTc0MFx1RkYwQ1x1OEJCRVx1N0Y2RVx1NEUzQSAwLjAuMC4wIFx1NjIxNlx1ODAwNSB0cnVlIFx1NUMwNlx1NzZEMVx1NTQyQ1x1NjI0MFx1NjcwOVx1NTczMFx1NTc0MFx1RkYwQ1x1NTMwNVx1NjJFQ1x1NUM0MFx1NTdERlx1N0Y1MVx1NTQ4Q1x1NTE2Q1x1N0Y1MVx1NTczMFx1NTc0MFx1MzAwMlxuICAgICAgY29yczogdHJ1ZSxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJ1xuICAgICAgfSxcbiAgICAgIHByb3h5OiB7XG4gICAgICAgIC8vIFx1NEUzQVx1NUYwMFx1NTNEMVx1NjcwRFx1NTJBMVx1NTY2OFx1OTE0RFx1N0Y2RVx1ODFFQVx1NUI5QVx1NEU0OVx1NEVFM1x1NzQwNlx1ODlDNFx1NTIxOVx1MzAwMlxuICAgICAgICAnL2FwaSc6IHtcbiAgICAgICAgICAvLyB0YXJnZXQ6ICdodHRwczovL3d3dy4wMGdvby5jb20vbWFuYWdlJywgLy8gXHU2RDRCXHU4QkQ1XHU3M0FGXHU1ODgzXG4gICAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly83Yjg1Yjc3Yy5yMjcuY3BvbGFyLnRvcC9tYW5hZ2UnLCAvLyBcdTVGOTBcdTRFRDlcdTY3MkNcdTU3MzBcdTczQUZcdTU4ODNcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sICcnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBa1QsU0FBUyxlQUFlLFdBQVc7QUFDclYsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUyw0QkFBNEI7QUFDckMsT0FBTyxTQUFTO0FBQ2hCLFNBQTBDLGVBQWU7QUFKc0ksSUFBTSwyQ0FBMkM7QUFNaFAsSUFBTSxNQUFNLFFBQVEsSUFBSTtBQUd4QixJQUFPLHNCQUFRLENBQUMsRUFBRSxTQUFTLEtBQUssTUFBNkI7QUFHM0QsUUFBTSxFQUFFLGNBQWMsSUFBSSxRQUFRLE1BQU0sR0FBRztBQUczQyxRQUFNLFVBQVUsWUFBWTtBQUM1QixVQUFRLElBQUksV0FBVyxPQUFPO0FBRTlCLFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQTtBQUFBLElBQ04sU0FBUztBQUFBO0FBQUEsSUFFVDtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsSUFBSTtBQUFBLE1BQ0osV0FBVztBQUFBLFFBQ1QsV0FBVztBQUFBLFVBQ1QscUJBQXFCO0FBQUEsWUFDbkIsYUFBYTtBQUFBO0FBQUEsVUFDZixDQUFDO0FBQUEsUUFDSDtBQUFBLE1BQ0YsQ0FBQztBQUFBLElBQ0g7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsTUFDdEQ7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUVBLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQTtBQUFBLE1BQ04sTUFBTTtBQUFBO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixTQUFTO0FBQUEsUUFDUCwrQkFBK0I7QUFBQSxNQUNqQztBQUFBLE1BQ0EsT0FBTztBQUFBO0FBQUEsUUFFTCxRQUFRO0FBQUE7QUFBQSxVQUVOLFFBQVE7QUFBQTtBQUFBLFVBQ1IsY0FBYztBQUFBLFVBQ2QsU0FBUyxDQUFDLFNBQVMsS0FBSyxRQUFRLFVBQVUsRUFBRTtBQUFBLFFBQzlDO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7IiwKICAibmFtZXMiOiBbXQp9Cg==
