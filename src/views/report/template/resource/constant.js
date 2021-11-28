/**
 * Created by 9I
 * @Date 2021/10/26
 * @description
 */

export const conclusion = {
  description: '癌症是一种可改变细胞代谢和分泌物的疾病，已有大量研究表明，代谢组学、蛋白组学以及医学影像人工智能检测技术在多种癌症早期发现中具有重大价值。本项目对肺癌高度相关的生化分子进行检测，并结合肺部CT影像人工智能阅片等多组学技术，提供肺结节患者恶性病变风险评估。经多组学分析，该受检者肺小结节良恶性评估为：',
  hint: '提示您肺癌发生风险较高，建议进一步诊疗或严密跟踪。',
  content: '具体请临床医生结合患者的临床症状及本次检测结果进行综合分析。'
}

export const proteinResult = {
  interpretation: '上图结果为肺癌发生发展中某些显著性差异的内源性分子物质的含量情况，每个格子表示一种肿瘤生化分子，其中浅色部分表示肿瘤生化分子含量低，深色部分表示肿瘤生化分子含量高。总体生化分子的含量指示了患肿瘤的风险。生化分子组学检测结果通过人工智能分析算法对总体检出的生化分子组分及含量进行综合健康评分，检测得分在0-100之间，分值越大，表示您肺结节恶变的风险越大。',
  high: {
    suggest: '表示检测到恶性代谢异常早期信号，高度可疑，建议进一步诊疗或密切随访。'
  },
  mid: {
    suggest: '表示检测到恶性代谢异常早期信号，高度可疑，建议进一步诊疗或密切随访。'
  }
}

export const dicomResult = {
  interpretation: '建议由临床医生综合临床表型，考虑是否进一步诊疗或严密跟踪。'
}