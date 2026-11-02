package com.minicaas.controller;

import com.minicaas.dto.ApiResponse;
import com.minicaas.dto.ResourceQuotaDto;
import com.minicaas.dto.TeamDto;
import com.minicaas.service.TeamService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TeamDto>>> getAllTeams() {
        List<TeamDto> teams = teamService.getAllTeams();
        return ResponseEntity.ok(ApiResponse.ok(teams));
    }

    @GetMapping("/{name}")
    public ResponseEntity<ApiResponse<TeamDto>> getTeamByName(@PathVariable String name) {
        TeamDto team = teamService.getTeamByName(name);
        return ResponseEntity.ok(ApiResponse.ok(team));
    }

    @PutMapping("/{name}/quota")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ResourceQuotaDto>> updateTeamQuota(
        @PathVariable String name,
        @RequestBody ResourceQuotaDto updateDto
    ) {
        ResourceQuotaDto updated = teamService.updateTeamQuota(name, updateDto);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật ResourceQuota thành công", updated));
    }
}
