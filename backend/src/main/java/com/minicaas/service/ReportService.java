package com.minicaas.service;

import com.minicaas.dto.DemoSessionDto;
import com.minicaas.dto.DemoTestResultDto;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Service
public class ReportService {

    private final DemoHistoryService demoHistoryService;

    public ReportService(DemoHistoryService demoHistoryService) {
        this.demoHistoryService = demoHistoryService;
    }

    public byte[] exportSessionCsv(UUID sessionId) {
        DemoSessionDto session = demoHistoryService.getSessionDetails(sessionId);
        StringBuilder sb = new StringBuilder();
        sb.append("Session ID,Session Name,Executed By,Start Time,End Time,Overall Status\n");
        sb.append(String.format("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"\n\n",
            session.getId(), session.getSessionName(), session.getExecutedByUsername(),
            session.getStartTime(), session.getEndTime(), session.getStatus()));

        sb.append("Test Code,Test Name,Status,Expected Result,Actual Result,Executed At\n");
        for (DemoTestResultDto tr : session.getTestResults()) {
            sb.append(String.format("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"\n",
                tr.getTestCode(),
                escapeCsv(tr.getTestName()),
                tr.getStatus(),
                escapeCsv(tr.getExpectedResult()),
                escapeCsv(tr.getActualResult()),
                tr.getExecutedAt()));
        }

        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    public byte[] exportSessionMarkdown(UUID sessionId) {
        DemoSessionDto session = demoHistoryService.getSessionDetails(sessionId);
        StringBuilder sb = new StringBuilder();
        sb.append("# BÁO CÁO KẾT QUẢ KIỂM THỬ NỀN TẢNG MINI CAAS PLATFORM\n\n");
        sb.append("**Phiên kiểm thử:** ").append(session.getSessionName()).append("\n");
        sb.append("**Người thực hiện:** ").append(session.getExecutedByUsername()).append("\n");
        sb.append("**Thời gian bắt đầu:** ").append(session.getStartTime()).append("\n");
        sb.append("**Thời gian kết thúc:** ").append(session.getEndTime()).append("\n");
        sb.append("**Trạng thái tổng thể:** ").append(session.getStatus()).append("\n");
        sb.append("**Kết luận:** ").append(session.getOverallConclusion()).append("\n\n");

        sb.append("## BẢNG KẾT QUẢ TỪNG BÀI TEST\n\n");
        sb.append("| Mã Test | Tên Bài Kiểm Thử | Trạng Thái | Kết Quả Thực Tế |\n");
        sb.append("|---|---|---|---|\n");
        for (DemoTestResultDto tr : session.getTestResults()) {
            sb.append(String.format("| `%s` | %s | **%s** | %s |\n",
                tr.getTestCode(), tr.getTestName(), tr.getStatus(), tr.getActualResult()));
        }

        sb.append("\n## BẰNG CHỨNG KỸ THUẬT VÀ NHẬT KÝ\n\n");
        for (DemoTestResultDto tr : session.getTestResults()) {
            sb.append("### ").append(tr.getTestCode()).append(" – ").append(tr.getTestName()).append("\n");
            sb.append("- **Mục tiêu:** ").append(tr.getObjective()).append("\n");
            sb.append("- **Kỳ vọng:** ").append(tr.getExpectedResult()).append("\n");
            sb.append("- **Thực tế:** ").append(tr.getActualResult()).append("\n");
            sb.append("```text\n").append(tr.getExecutionLog()).append("\n```\n\n");
        }

        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    private String escapeCsv(String input) {
        if (input == null) return "";
        return input.replace("\"", "\"\"").replace("\n", " ");
    }
}
