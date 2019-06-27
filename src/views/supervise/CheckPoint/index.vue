<template>
  <d2-container>
    <template slot="header">
      <el-switch v-model="isLong" active-text="核查点空间分布" inactive-text="核查点管理" />
    </template>
    <div v-show="!isLong">
      <!-- 搜索条件 -->
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="编号">
          <el-input v-model="submitForm.pointNumber"></el-input>
        </el-form-item>
        <el-form-item label="所属保护地">
          <el-select v-model="submitForm.prodAreaVal" placeholder="请选择">
            <el-option v-for="item in form.prodArea" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="核查任务">
          <el-select v-model="submitForm.checkTaskVal" placeholder="请选择">
            <el-option v-for="item in form.checkTask" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属行政区">
          <el-select v-model="submitForm.belongAreaVal" placeholder="请选择">
            <el-option v-for="item in form.belongArea" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
      <!-- 表格数据 -->
      <div class="block">
        <!-- 数据表 -->
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column prop="id" v-if="false">
          </el-table-column>
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column type="index" label="序号" align="center">
          </el-table-column>
          <el-table-column label="编号" width="80" align="center">
            <el-link type="primary" slot-scope="scope" @click="hisBill(scope.$index, scope.row)">{{ scope.row.number }}
            </el-link>
          </el-table-column>
          <el-table-column label="历史编号" width="80" align="center">
            <el-link type="primary" slot-scope="scope" @click="billDetail(scope.$index, scope.row)">{{ scope.row.hisNum }}</el-link>
          </el-table-column>
          <el-table-column prop="lon" label="经度" width="120" align="center">
          </el-table-column>
          <el-table-column prop="lat" label="纬度" width="120" align="center">
          </el-table-column>
          <el-table-column prop="proArea" label="所属保护地" show-overflow-tooltip align="center">
          </el-table-column>
          <el-table-column prop="district" label="所属行政区" width="150" show-overflow-tooltip align="center">
          </el-table-column>
          <el-table-column prop="task" label="核查任务" width="180" show-overflow-tooltip align="center">
          </el-table-column>
          <el-table-column prop="status" label="核查状态" width="100" align="center">
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="success" @click="hisBill(scope.$index, scope.row)">历史台账</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="currentPage1" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize1"
          layout="total, sizes, prev, pager, next, jumper" :total="totalPage1">
        </el-pagination>
      </div>
      <!-- 历史台账对话框 -->
      <el-dialog title="历史台账" :visible.sync="dialogTableVisible" width="30%">
        <el-table :data="hisData" border>
          <el-table-column prop="id" v-if="false"></el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column property="quesDetail" label="问题描述(问题名称)" align="center"></el-table-column>
          <el-table-column property="lon" label="经度" align="center"></el-table-column>
          <el-table-column property="lat" label="纬度" align="center"></el-table-column>
          <el-table-column property="belongArea" label="所属功能区" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <el-link type="primary" slot-scope="scope" @click="billDetail(scope.$index, scope.row)">查看详情</el-link>
          </el-table-column>
        </el-table>
        <!-- 历史台账分页 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="currentPage2" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize2"
          layout="total, sizes, prev, pager, next, jumper" :total="totalPage2">
        </el-pagination>
      </el-dialog>

      <!-- 台账详情对话框 -->
      <el-dialog title="提示" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
        <div class="basicInfo">
          <h2>基本信息</h2>
          <p class="w50 h1">
            <el-input :disabled="true" v-model="billDetails.basicInfo.prodName">
              <template slot="prepend">保 护 区 名 称</template>
            </el-input>
          </p>
          <p class="w50 h1">
            <el-input :disabled="true" v-model="billDetails.basicInfo.belongArea">
              <template slot="prepend">所 属 功 能 区</template>
            </el-input>
          </p>
          <p class="w50 h1">
            <el-input :disabled="true" v-model="billDetails.basicInfo.lon">
              <template slot="prepend">经 度</template>
            </el-input>
          </p>
          <p class="w50 h1">
            <el-input :disabled="true" v-model="billDetails.basicInfo.lat">
              <template slot="prepend">纬 度</template>
            </el-input>
          </p>
          <p class="w50 h1">
            <el-input :disabled="true" v-model="billDetails.basicInfo.acreage">
              <template slot="prepend">面 积</template>
            </el-input>
          </p>
          <p class="w50 h1">
            <el-input :disabled="true" v-model="billDetails.basicInfo.placeDescribe">
              <template slot="prepend">所 在 位 置 描 述</template>
            </el-input>
          </p>
          <p class="w50 h1">
            <el-input :disabled="true" v-model="billDetails.basicInfo.activeName">
              <template slot="prepend">活 动 设 施 名 称</template>
            </el-input>
          </p>
          <p class="w50 h1">
            <el-input :disabled="true" v-model="billDetails.basicInfo.activeState">
              <template slot="prepend">活 动 设 施 现 状</template>
            </el-input>
          </p>
          <p class="w50 h1">
            <el-input :disabled="true" v-model="billDetails.basicInfo.changeType">
              <template slot="prepend">变 化 类 型</template>
            </el-input>
          </p>
          <p class="w50 h1">
            <el-input :disabled="true" v-model="billDetails.basicInfo.quesType">
              <template slot="prepend">问 题 类 型</template>
            </el-input>
          </p>
          <p class="w50 h1">
            <el-input :disabled="true" v-model="billDetails.basicInfo.buildTime">
              <template slot="prepend">建 设 时 间</template>
            </el-input>
          </p>
          <p class="w50 h1">
            <el-input :disabled="true" v-model="billDetails.basicInfo.buildUnit">
              <template slot="prepend">建 设 单 位</template>
            </el-input>
          </p>
          <p class="w100">
            <el-input :disabled="true" v-model="billDetails.basicInfo.quesDescribe">
              <template slot="prepend">问 题 描 述 ( 问 题 名 称 )</template>
            </el-input>
          </p>
        </div>
        <div class="breakLow">
          <h2>违规与手续情况</h2>
          <p class="w100">
            <el-input :disabled="true" v-model="billDetails.procdescribe.breakLow">
              <template slot="prepend">是否违法违规</template>
            </el-input>
          </p>
          <p class="w100">
            <el-input :disabled="true" v-model="billDetails.procdescribe.quesAndEffect">
              <template slot="prepend">存 在 问 题 及 主 要 生 态 影 响</template>
            </el-input>
          </p>
          <p class="w50 h2">
            <el-input :disabled="true" v-model="billDetails.procdescribe.hasDevelopment">
              <template slot="prepend">有 无 发 改 部 门 相 关 手 续</template>
            </el-input>
          </p>
          <p class="w50 h2">
            <el-input :disabled="true" v-model="billDetails.procdescribe.developmentNum">
              <template slot="prepend">发 改 部 门 相 关 手 续 批 复 及 验 收 文 号</template>
            </el-input>
          </p>
          <p class="w50 h2">
            <el-input :disabled="true" v-model="billDetails.procdescribe.hasProject">
              <template slot="prepend">有 无 规 划 和 自 然 资 源 部 门 相 关 规 划 、 国 土 、 林 业 等 手 续</template>
            </el-input>
          </p>
          <p class="w50 h2">
            <el-input :disabled="true" v-model="billDetails.procdescribe.projectNum">
              <template slot="prepend">规 划 和 自 然 资 源 部 门 相 关 规 划 、 国 土 、 林 业 等 手 续 批 复 及 验 收 文 号</template>
            </el-input>
          </p>
          <p class="w50 h2">
            <el-input :disabled="true" v-model="billDetails.procdescribe.hasFarming">
              <template slot="prepend">有 无 农 业 农 村 部 门 相 关 养 殖 等 手 续</template>
            </el-input>
          </p>
          <p class="w50 h2">
            <el-input :disabled="true" v-model="billDetails.procdescribe.farmingNum">
              <template slot="prepend">农 业 农 村 部 门 相 关 养 殖 等 手 续 批 复 及 验 收 文 号</template>
            </el-input>
          </p>
          <p class="w50 h2">
            <el-input :disabled="true" v-model="billDetails.procdescribe.hasCulture">
              <template slot="prepend">有 无 文 化 和 旅 游 部 门 相 关 旅 游 手 续</template>
            </el-input>
          </p>
          <p class="w50 h2">
            <el-input :disabled="true" v-model="billDetails.procdescribe.cultureNum">
              <template slot="prepend">文 化 和 旅 游 部 门 相 关 旅 游 手 续 批 复 及 验 收 文 号</template>
            </el-input>
          </p>
          <p class="w50 h2">
            <el-input :disabled="true" v-model="billDetails.procdescribe.hasMarket">
              <template slot="prepend">有 无 市 场 监 督 管 理 部 门 相 关 工 商 营 业 执 照 手 续</template>
            </el-input>
          </p>
          <p class="w50 h2">
            <el-input :disabled="true" v-model="billDetails.procdescribe.marketNum">
              <template slot="prepend">市 场 监 督 管 理 部 门 相 关 工 商 营 业 执 照 手 续 批 复 及 验 收 文 号</template>
            </el-input>
          </p>
          <p class="w50 h2">
            <el-input :disabled="true" v-model="billDetails.procdescribe.hasFinance">
              <template slot="prepend">有 无 财 政 部 门 相 关 资 金 手 续</template>
            </el-input>
          </p>
          <p class="w50 h2">
            <el-input :disabled="true" v-model="billDetails.procdescribe.fianceNum">
              <template slot="prepend">财 政 部 门 相 关 资 金 手 续 批 复 及 验 收 文 号</template>
            </el-input>
          </p>
          <p class="w50 h2">
            <el-input :disabled="true" v-model="billDetails.procdescribe.hasEvironment">
              <template slot="prepend">有 无 环 评 手 续</template>
            </el-input>
          </p>
          <p class="w50 h2">
            <el-input :disabled="true" v-model="billDetails.procdescribe.evironmentNum">
              <template slot="prepend">环 评 手 续 批 复 及 验 收 文 号</template>
            </el-input>
          </p>
          <p class="w50 h2">
            <el-input :disabled="true" v-model="billDetails.procdescribe.hasOthers">
              <template slot="prepend">有 无 其 他 相 关 审 批 手 续 或 行 政 许 可 手 续 批 复 及 验 收 文 号</template>
            </el-input>
          </p>
          <p class="w50 h2">
            <el-input :disabled="true" v-model="billDetails.procdescribe.othProcedure">
              <template slot="prepend">其 他 相 关 审 批 手 续 或 行 政 许 可 手 续</template>
            </el-input>
          </p>
        </div>
        <div class="dealStatus">
          <h2>处理与整改情况</h2>
          <p class="w50 h1">
            <el-input :disabled="true" v-model="billDetails.dealStatus.fine">
              <template slot="prepend">是 否 罚 款</template>
            </el-input>
          </p>
          <p class="w50 h1">
            <el-input :disabled="true" v-model="billDetails.dealStatus.punishType">
              <template slot="prepend">处 罚 方 式</template>
            </el-input>
          </p>
          <p class="w50 h1">
            <el-input :disabled="true" v-model="billDetails.dealStatus.penalty">
              <template slot="prepend">罚 款 ( 万 元 )</template>
            </el-input>
          </p>
          <p class="w50 h1">
            <el-input :disabled="true" v-model="billDetails.dealStatus.amendMeasure">
              <template slot="prepend">整 改 措 施</template>
            </el-input>
          </p>
          <p class="w50 h1">
            <el-input :disabled="true" v-model="billDetails.dealStatus.amendTime">
              <template slot="prepend">整 改 时 限</template>
            </el-input>
          </p>
          <p class="w50 h1">
            <el-input :disabled="true" v-model="billDetails.dealStatus.amendStep">
              <template slot="prepend">整 改 进 度</template>
            </el-input>
          </p>
          <p class="w50 h1">
            <el-input :disabled="true" v-model="billDetails.dealStatus.amendState">
              <template slot="prepend">整 改 状 态</template>
            </el-input>
          </p>
          <p class="w50 h1">
            <el-input :disabled="true" v-model="billDetails.dealStatus.disArea">
              <template slot="prepend">拆 除 建 筑 面 积 ( 平 方 米 )</template>
            </el-input>
          </p>
          <p class="w50 h1">
            <el-input :disabled="true" v-model="billDetails.dealStatus.disposeStatus">
              <template slot="prepend">处 理 情 况</template>
            </el-input>
          </p>
          <p class="w50 h1">
            <el-input :disabled="true" v-model="billDetails.dealStatus.logout">
              <template slot="prepend">是 否 销 号</template>
            </el-input>
          </p>
          <div class="w50 h1 imgs">
            <div class="el-input-group__prepend">整 改 前 照 片</div>
            <img :src="billDetails.dealStatus.beforeAmendPic" alt="">
          </div>
          <div class="w50 h1 imgs">
            <div class="el-input-group__prepend">整 改 后 照 片</div>
            <img :src="billDetails.dealStatus.afterAmendPic" alt="">
          </div>
          <div class="w50 h1 imgs">
            <div class="el-input-group__prepend">整 改 进 展 照 片</div>
            <img :src="billDetails.dealStatus.stepAmendPic" alt="">
          </div>
        </div>
        <div class="checkInfo">
          <h2>核查人信息</h2>
          <p class="w50 h1">
            <el-input :disabled="true" v-model="billDetails.checkInfo.checkPointName">
              <template slot="prepend">核 查 点 名 称</template>
            </el-input>
          </p>
          <p class="w50 h1">
            <el-input :disabled="true" v-model="billDetails.checkInfo.checkUnit">
              <template slot="prepend">核 查 单 位</template>
            </el-input>
          </p>
          <p class="w50 h1">
            <el-input :disabled="true" v-model="billDetails.checkInfo.checkTime">
              <template slot="prepend">核 查 时 间</template>
            </el-input>
          </p>
          <p class="w50 h1">
            <el-input :disabled="true" v-model="billDetails.checkInfo.checkPerson">
              <template slot="prepend">核 查 人</template>
            </el-input>
          </p>
          <p class="w50 h1">
            <el-input :disabled="true" v-model="billDetails.checkInfo.contactWay">
              <template slot="prepend">联 系 方 式</template>
            </el-input>
          </p>
          <p class="w50 h1">
            <el-input :disabled="true" v-model="billDetails.checkInfo.joinNumber">
              <template slot="prepend">参 与 核 查 人 数</template>
            </el-input>
          </p>
          <p class="w50 h1">
            <el-input :disabled="true" v-model="billDetails.checkInfo.preparer">
              <template slot="prepend">填 表 人</template>
            </el-input>
          </p>
          <p class="w50 h1">
            <el-input :disabled="true" v-model="billDetails.checkInfo.verifier">
              <template slot="prepend">审 核 人</template>
            </el-input>
          </p>
          <p class="w50 h1">
            <el-input :disabled="true" v-model="billDetails.checkInfo.remark">
              <template slot="prepend">备 注</template>
            </el-input>
          </p>
        </div>
        <div class="accoStatus">
          <h2>问责情况</h2>
          <p class="w50 h3">
            <el-input :disabled="true" v-model="billDetails.accoStatus.dutyFormAuditor">
              <template slot="prepend">追 责 问 责 情 况 表 审 核 人</template>
            </el-input>
          </p>
          <p class="w50 h3">
            <el-input :disabled="true" v-model="billDetails.accoStatus.dutyFormPreparer">
              <template slot="prepend">追 责 问 责 情 况 表 填 表 人</template>
            </el-input>
          </p>
          <p class="w50 h3">
            <el-input :disabled="true" v-model="billDetails.accoStatus.dutyFormConcatWay">
              <template slot="prepend">追 责 问 责 情 况 表 联 系 方 式</template>
            </el-input>
          </p>
          <p class="w50 h3">
            <el-input :disabled="true" v-model="billDetails.accoStatus.proDutyNum">
              <template slot="prepend">省 级 追 责 问 责 人 数</template>
            </el-input>
          </p>
          <p class="w50 h3">
            <el-input :disabled="true" v-model="billDetails.accoStatus.officeDutyNum">
              <template slot="prepend">厅 级 追 责 问 责 人 数</template>
            </el-input>
          </p>
          <p class="w50 h3">
            <el-input :disabled="true" v-model="billDetails.accoStatus.countyDutyNum">
              <template slot="prepend">县 级 追 责 问 责 人 数</template>
            </el-input>
          </p>
          <p class="w50 h3">
            <el-input :disabled="true" v-model="billDetails.accoStatus.subjectDutyNum">
              <template slot="prepend">科 级 追 责 问 责 人 数</template>
            </el-input>
          </p>
          <p class="w50 h3">
            <el-input :disabled="true" v-model="billDetails.accoStatus.otherDutyNum">
              <template slot="prepend">其 他 追 责 问 责 人 数</template>
            </el-input>
          </p>
          <p class="w50 h3">
            <el-input :disabled="true" v-model="billDetails.accoStatus.partyIllegalNum">
              <template slot="prepend">党 纪 政 纪 处 分 人 数</template>
            </el-input>
          </p>
          <p class="w50 h3">
            <el-input :disabled="true" v-model="billDetails.accoStatus.warnPersonNum">
              <template slot="prepend">诫 勉 谈 话 人 数</template>
            </el-input>
          </p>
          <p class="w50 h3">
            <el-input :disabled="true" v-model="billDetails.accoStatus.criticialNum">
              <template slot="prepend">通 报 批 评 人 数</template>
            </el-input>
          </p>
          <p class="w50 h3">
            <el-input :disabled="true" v-model="billDetails.accoStatus.dutyFormRemark">
              <template slot="prepend">追 责 问 责 情 况 表 备 注</template>
            </el-input>
          </p>
        </div>
      </el-dialog>
    </div>
    <div v-show="isLong">
      核查点空间分布
    </div>
  </d2-container>
  </div>
</template>

<script>
/* eslint-disable */
  export default {
    name: 'CheckPoint',
    data() {
      return {
        isLong: false, // tab切换

        // 下拉框数据
        form: {
          // 所属保护地
          prodArea: [{
              value: '天津大黄堡湿地自然保护区',
              label: '天津大黄堡湿地自然保护区'
            },
            {
              value: '天津青龙湾固沙林自然保护区',
              label: '天津青龙湾固沙林自然保护区'
            },
            {
              value: '天津北大港湿地国家级自然保护区(宁河区)',
              label: '天津北大港湿地国家级自然保护区(宁河区)'
            },
            {
              value: '天津市团泊鸟类自然保护区',
              label: '天津市团泊鸟类自然保护区'
            },
            {
              value: '天津八仙山自然保护区',
              label: '天津八仙山自然保护区'
            }
          ],

          // 核查任务
          checkTask: [{
              value: '2019团泊湖巡查任务',
              label: '2019团泊湖巡查任务'
            },
            {
              value: '任务1',
              label: '任务1'
            },
            {
              value: '任务二',
              label: '任务二'
            }
          ],

          // 所属行政区
          belongArea: [{
              value: '和平区',
              label: '和平区'
            },
            {
              value: '河东区',
              label: '河东区'
            },
            {
              value: '河西区',
              label: '河西区'
            },
            {
              value: '南开区',
              label: '南开区'
            },
            {
              value: '河北区',
              label: '河北区'
            },
            {
              value: '红桥区',
              label: '红桥区'
            }
          ]
        },

        // 搜索提交数据
        submitForm: {
          pointNumber: '', // 核查点编号
          prodAreaVal: '', // 所属保护区
          checkTaskVal: '', // 核查任务
          belongAreaVal: '', // 所属行政区
        },

        // 数据表
        tableData: [],
        multipleSelection: [],

        // 数据表分页
        currentPage1: 1, // 展示页码
        pageSize1: 10, // 每页展示条数
        totalPage1: 100, // 总条数

        dialogTableVisible: false, // 是否展示历史台账对话框

        // 历史台账对话框数据
        hisData: [],

        // 历史台账分页
        currentPage2: 1, // 展示页码
        pageSize2: 10, // 每页展示条数
        totalPage2: 10, // 总条数

        dialogVisible: false, // 是否展示台账详情对话框

        // 台账详情
        billDetails: {
          /* 基本信息 */
          basicInfo: {
            prodName: '', // 保护区名称
            belongArea: '', // 所属功能分区
            lon: '',  // 经度
            lat: '',  // 纬度
            acreage: '',  // 面积
            placeDescribe: '',   // 所在位置描述
            activeName: '',   // 活动设施名称
            activeState: '',  // 活动设施现状
            changeType: '',   // 变化类型
            quesType: '',   // 问题类型
            buildTime: '',    // 建设时间
            buildUnit: '',    // 建设单位
            quesDescribe: ''    // 问题描述
          },
          /* 违规与手续情况 */
          procdescribe: {
            breakLow: '', // 是否违法违规
            quesAndEffect: '',  // 存在问题及主要生态影响
            hasDevelopment: '', // 有无发改部门相关手续
            developmentNum: '', // 发改部门相关手续批复及验收文号
            hasProject: '', // 有无规划和自然资源部门相关规划,国土,林业等手续
            projectNum: '', // 规划和自然资源部门相关规划,国土,林业等手续批复及验收文号
            hasFarming: '', // 有无农业农村部门相关养殖等手续
            farmingNum: '', // 农业农村部门相关养殖等手续批复及验收文号
            hasCulture: '', // 有无文化和旅游部门相关旅游手续
            cultureNum: '', // 文化和旅游部门相关旅游手续批复及验收文号
            hasMarket: '',  // 有无市场监督管理部门相关工商营业执照手续
            marketNum: '',  // 市场监督管理部门相关工商营业执照手续批复及验收文号
            hasFinance: '', // 有无财政部门相关资金手续
            fianceNum: '',  // 财政部门相关资金手续批复及验收文号
            hasEvironment: '',  // 有无环评手续
            evironmentNum: '',  // 环评手续批复及验收文号
            hasOthers: '',  // 有无其他相关审批手续或行政许可手续批复及验收文号
            othProcedure: ''  // 其他相关审批手续或行政许可手续
          },
          /* 处理与整改情况 */
          dealStatus: {
            fine: '', // 是否罚款
            punishType: '', // 处罚方式
            penalty: '',  // 罚款
            amendMeasure: '', // 整改措施
            amendTime: '',  // 整改时限
            amendStep: '',  // 整改进度
            amendState: '', // 整改状态
            disArea: '',  // 拆除建筑面积
            disposeStatus: '',  // 处理情况
            logout: '', // 是否销号
            beforeAmendPic: '/image/theme/star/bg.jpg', // 整改前照片
            afterAmendPic: '/image/theme/star/bg.jpg',  // 整改后照片
            stepAmendPic: '/image/theme/star/bg.jpg'  // 整改进展照片
          },
          /* 核查人信息 */
          checkInfo: {
            checkPointName: '', // 核查点名称
            checkUnit: '',  // 核查单位
            checkTime: '',  // 核查时间
            checkPerson: '',  // 核查人
            contactWay: '', // 联系方式
            joinNumber: '', // 参与核查人数
            preparer: '', // 填表人
            verifier: '', // 审核人
            remark: ''  // 备注
          },
          /* 问责情况 */
          accoStatus: {
            dutyFormAuditor: '',  // 追责问责情况表审核人
            dutyFormPreparer: '', // 追责问责情况表填写人
            dutyFormConcatWay: '',  // 追责问责情况表联系方式
            proDutyNum: '', // 省级追责问责人数
            officeDutyNum: '',  // 厅级追责问责人数
            countyDutyNum: '',  // 县级追责问责人数
            subjectDutyNum: '', // 科级追责问责人数
            otherDutyNum: '', // 其他追责问责人数
            partyIllegalNum: '',  // 党政违纪处分人数
            warnPersonNum: '',  // 诫勉谈话人数
            criticialNum: '', // 通报批评人数
            dutyFormRemark: ''  // 追责问责情况表备注
          }
        }

      }
    },

    mounted() {
      this.getData();
    },
    methods: {
      // 初始化数据
      getData() {
        this.tableData = [];
        for (var i = 0; i < 10; i++) {
          let obj = {
            id: i,
            number: i,
            hisNum: '18-11',
            lon: '111.110000',
            lat: '111.110000',
            proArea: '天津八仙山国家级保护区天津八仙山国家级保护区天津八仙山国家级保护区',
            district: '蓟州区',
            task: '20190620任务',
            status: '已核查'
          };
          this.tableData.push(obj);
        }
        this.totalPage1 = 100;
      },

      // 搜索
      onSubmit() {
        console.log(JSON.parse(JSON.stringify(this.submitForm)));
      },


      /* 数据表 */
      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(val);
      },
      // 历史台账
      hisBill(index, row) {
        console.log(index, row);

        this.hisData = [];
        for (var i = 0; i < 10; i++) {
          let obj = {
            id: i,
            quesDetail: '测试退回',
            lon: '111.11',
            lat: '111.11',
            belongArea: '试验区',
          };
          this.hisData.push(obj);
        }
        this.totalPage2 = 10;

        this.dialogTableVisible = true;
      },

      billDetail(index, row) {
        console.log(index, row);
        this.dialogVisible = true;
      },

      // 分页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },

    }
  }
</script>

<style lang="scss" scoped>
  .w50.h1 {
    display: inline-block;
    width: 40%;
    margin: 1% 5%;
    height: 40px;
  }

  .w50.h2 {
    display: inline-block;
    width: 40%;
    margin: 1% 5%;
    height: 100px;
  }

  .w50.h3 {
    display: inline-block;
    width: 40%;
    margin: 1% 5%;
    height: 60px;
  }

  .w100 {
    width: 90%;
    margin: 1% 5%;
  }

  .dealStatus .imgs {
    height: auto;
  }

  .dealStatus .imgs .el-input-group__prepend {
    display: inline-block;
    height: 50%;
    width: 34%;
  }

  .dealStatus .imgs img {
    width: 40%;
    vertical-align: top;
  }
</style>

<style scoped>
  >>>.el-input-group,
  >>>.el-input-group .el-input__inner {
    height: 100%;
  }

  >>>.el-input-group__prepend {
    width: 40%;
    white-space: pre-wrap;
    height: 100%;
    padding: 3%;
  }

  >>>.el-input-group .el-input__inner {
    width: 100%;
    white-space: pre-wrap;
  }

  .w100>>>.el-input-group__prepend {
    width: 18%;
    padding: 1.5%;
  }
</style>