# User Flow — CAT (Danh muc)

> Sinh bởi /qc_user_flow — 2026-06-11T11:35:00
> Input: CAT | ENV: local | APP_URL: https://pehn02.vnresource.net:4406/#/Hrm_Main_Web
> Crawl: 365 màn hình | 365 thành công | 0 thất bại

---

## Sơ đồ luồng

```
GROUP: CAT — Danh muc
│
│  ═══════════════════════════════════════════════════════════════
│  PATTERN CHUNG (áp dụng cho 350+ alias kiểu List screen)
│  ═══════════════════════════════════════════════════════════════
│  Tất cả màn hình CAT đều theo cùng 1 pattern:
│    Loại: List screen + inline dialog/navigate-to-create
│    Toolbar chuẩn: Tạo mới | Tìm kiếm | Xuất excel | Đổi cột | Xóa
│    Tạo mới: mở dialog inline HOẶC navigate sang /Create (tùy màn hình)
│    Sửa: click row → navigate sang /Edit/{id}
│    Xóa: chọn record → click Xóa → confirm
│
│  ═══════════════════════════════════════════════════════════════
│  NHÓM 1 — Tuyển dụng (cat_*)
│  ═══════════════════════════════════════════════════════════════
│
├── [cat_job_description_group] DS Nhóm động lực
│     URL: /Cat_JobDescriptionGroup/Index  |  Loại: List screen
│     │
│     ├── FEATURE: Danh sách
│     │     SCREEN: List screen
│     │       --[Tìm kiếm]--> lọc danh sách (inline)
│     │       --[Xuất excel]--> tải file .xlsx
│     │
│     ├── FEATURE: Tạo mới
│     │     SCREEN: (Dialog inline: Tạo mới nhóm động lực)
│     │       Nhập: Tên nhóm*, Mã*, Ghi chú
│     │       --[Lưu và đóng]--> ✓ toast: "Lưu thành công" --> [cat_job_description_group]
│     │       --[Hủy]--> [cat_job_description_group]
│     │
│     ├── FEATURE: Chỉnh sửa
│     │     SCREEN: (Dialog inline: Sửa nhóm động lực)
│     │       Nhập: Tên nhóm, Mã, Ghi chú
│     │       --[Lưu và đóng]--> ✓ toast: "Cập nhật thành công" --> [cat_job_description_group]
│     │       --[Hủy]--> [cat_job_description_group]
│     │
│     └── FEATURE: Xóa
│           SCREEN: (Confirm: Xác nhận xóa?)
│             --[Đồng ý]--> ✓ toast: "Xóa thành công" --> [cat_job_description_group]
│             --[Hủy]--> [cat_job_description_group]
│
├── [cat_resposibility_group] DS Nhóm trách nhiệm
│     URL: /Cat_ResposibilityGroup/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG — dialog inline: Tên, Mã, Ghi chú]
│
├── [cat_generic_group] DS Nhóm đặc trưng
│     URL: /Cat_GenericGroup/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_motivation] DS Động lực
│     URL: /Cat_Motivation/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG — fields: Tên, Mã, Nhóm động lực (combobox), Ghi chú]
│
├── [cat_job_description] DS Trách nhiệm
│     URL: /Cat_JobDescription/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG — fields: Tên, Mã, Nhóm trách nhiệm (combobox), Ghi chú]
│
├── [cat_characteristics] DS Đặc trưng
│     URL: /Cat_Characteristics/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_sick] DS Bệnh lý
│     URL: /Cat_Sick/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG — fields: Tên bệnh*, Mã*]
│
├── [cat_activity_areas] DS Lĩnh vực hoạt động
│     URL: /Cat_ActivityAreas/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_evaluate_candidate_reject_reason] DS Lý do từ chối phỏng vấn
│     URL: /Cat_EvaluateCandidateRejectReason/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_job_vancancy_reson] DS Lý do thay thế
│     URL: /Cat_JobVancancyReson/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_black_list_reson] DS Lý do vào DS đen
│     URL: /Cat_BlackListReson/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_internal_application_reason] DS Lý do ứng tuyển nội bộ
│     URL: /Cat_InternalApplicationReason/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_rank] DS Đối tượng tuyển
│     URL: /Cat_Rank/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_area_post_job] DS Vùng đăng tuyển
│     URL: /Cat_AreaPostJob/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_cost_recruitment] DS Chi phí tuyển dụng
│     URL: /Cat_CostRecruitment/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_source_ads] DS Nhà cung cấp dịch vụ tuyển dụng
│     URL: /Cat_SourceAds/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
│  ═══════════════════════════════════════════════════════════════
│  NHÓM 2 — Công việc nặng nhọc (HDT)
│  ═══════════════════════════════════════════════════════════════
│
├── [cat_hdtjob_group] DS Công việc HDT theo luật
│     URL: /Cat_HDTJobGroup/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_hdtjob_type] DS Vị trí công việc HDT
│     URL: /Cat_HDTJobType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_hdtjob_type_price] DS Mức bồi dưỡng CV HDT
│     URL: /Cat_HDTJobTypePrice/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_level_hdtjob] DS Cấp độ công việc HDT
│     URL: /Cat_LevelHDTJob/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
│  ═══════════════════════════════════════════════════════════════
│  NHÓM 3 — Kỷ luật / Khen thưởng
│  ═══════════════════════════════════════════════════════════════
│
├── [cat_discipline_case] DS Vụ việc
│     URL: /Cat_DisciplineCase/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_discipline_level] DS Cấp độ kỷ luật
│     URL: /Cat_DisciplineLevel/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_disciplined_types] DS Hình thức kỷ luật
│     URL: /Cat_DisciplinedTypes/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_discipline_reason] DS Lý do kỷ luật
│     URL: /Cat_DisciplineReason/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_violate_level] DS Loại vi phạm
│     URL: /Cat_ViolateLevel/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_violation_type] DS Loại vi phạm
│     URL: /Cat_ViolationType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_rewarded_decision_type] DS Loại khen thưởng
│     URL: /Cat_RewardedDecisionType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_rewarded_type] DS Hình thức khen thưởng
│     URL: /Cat_RewardedType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_rewarded_time] DS Quyết định 1
│     URL: /Cat_RewardedTime/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_rewarded_titles] DS Danh hiệu khen thưởng
│     URL: /Cat_RewardedTitles/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_rewarded_deciding_orgs] DS Cấp khen thưởng
│     URL: /Cat_RewardedDecidingOrgs/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_reason_donate] DS Lý do khen thưởng
│     URL: /Cat_ReasonDonate/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
│  ═══════════════════════════════════════════════════════════════
│  NHÓM 4 — Cơ cấu tổ chức / Vị trí công tác
│  ═══════════════════════════════════════════════════════════════
│
├── [cat_org_structure] DS Phòng ban
│     URL: /Cat_OrgStructure/Index  |  Loại: List screen
│     │
│     ├── FEATURE: Danh sách
│     │     SCREEN: List screen
│     │       --[Tìm kiếm]--> lọc theo Phòng ban, Mã phòng ban, Công ty, Loại phòng ban
│     │       --[Xuất excel]--> tải file .xlsx
│     │
│     ├── FEATURE: Tạo mới
│     │     SCREEN: (Dialog/Navigate: Tạo mới phòng ban)
│     │       Nhập: Phòng ban*, Mã phòng ban*, Công ty (combobox)*, Loại phòng ban (combobox),
│     │              Phòng ban cha (treeview), Nơi làm việc, Trưởng phòng ban (combobox), Ghi chú
│     │       --[Lưu]--> ✓ toast: "Lưu thành công" --> [cat_org_structure]
│     │       --[Hủy]--> [cat_org_structure]
│     │
│     ├── FEATURE: Chỉnh sửa
│     │     SCREEN: (Dialog/Navigate: Sửa phòng ban)
│     │       [Các field như Tạo mới]
│     │       --[Lưu]--> ✓ toast: "Cập nhật thành công"
│     │
│     ├── FEATURE: Xóa
│     │     SCREEN: (Confirm: Xác nhận xóa?)
│     │       --[Đồng ý]--> ✓ toast: "Xóa thành công"
│     │
│     └── FEATURE: Mở lại / Điều chỉnh cấu trúc
│           SCREEN: List screen (toolbar mở rộng)
│             --[Mở lại phòng ban]--> khôi phục phòng ban đã vô hiệu
│             --[Điều chỉnh cấu trúc phòng ban]--> sắp xếp lại cây tổ chức
│
├── [cat_org_structure_type] DS Loại phòng ban
│     URL: /Cat_OrgStructureType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG — fields: Tên loại*, Mã*]
│
├── [cat_job_title] DS Chức vụ
│     URL: /Cat_JobTitle/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG — fields: Tên chức vụ*, Mã*]
│
├── [cat_position] DS Vị trí công việc
│     URL: /Cat_Position/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG — fields: Tên vị trí*, Mã*, Phòng ban (combobox)]
│
├── [cat_ability_tile] DS Cấp bậc
│     URL: /Cat_AbilityTile/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_company] DS Công ty
│     URL: /Cat_Company/Index  |  Loại: List screen
│     │
│     ├── FEATURE: Danh sách
│     │     SCREEN: List screen
│     │       --[Tìm kiếm]--> lọc danh sách
│     │       --[Kết xuất]--> tải file .xlsx
│     │
│     ├── FEATURE: Tạo mới
│     │     SCREEN: (Dialog inline: Tạo mới công ty)
│     │       Nhập: Tên công ty*, Mã công ty*, Địa chỉ, MST, Người đại diện
│     │       --[Lưu và đóng]--> ✓ toast: "Lưu thành công"
│     │       --[Hủy]--> [cat_company]
│     │
│     ├── FEATURE: Chỉnh sửa
│     │     SCREEN: (Dialog inline: Sửa công ty)
│     │       --[Lưu và đóng]--> ✓ toast: "Cập nhật thành công"
│     │
│     └── FEATURE: Xóa
│           SCREEN: (Confirm: Xác nhận xóa?)
│             --[Đồng ý]--> ✓ toast: "Xóa thành công"
│
├── [cat_guarantee_companies] DS Công ty bảo lãnh
│     URL: /Cat_GuaranteeCompanies/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_unit_structure] DS Khối
│     URL: /Cat_UnitStructure/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_organization] DS Cơ quan
│     URL: /Cat_Organization/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_hrplanning_period] Kỳ định biên/ngân sách
│     URL: /Cat_HRPlanningPeriod/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_work_place] DS Nơi làm việc
│     URL: /Cat_WorkPlace/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_distribution_channel] DS Kênh phân phối
│     URL: /Cat_DistributionChannel/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_region_market] DS Vùng thị trường
│     URL: /Cat_RegionMarket/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_area_market] DS Khu vực thị trường
│     URL: /Cat_AreaMarket/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_market_domain] DS Miền thị trường
│     URL: /Cat_MarketDomain/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_distri_butoriginal] DS Nhà phân phối gốc
│     URL: /Cat_DistriButoriginal/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_type_of_transfer] DS Hình thức thay đổi
│     URL: /Cat_TypeOfTransfer/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_role] DS Vai trò
│     URL: /Cat_Role/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_role_group] DS Nhóm vai trò
│     URL: /Cat_RoleGroup/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_readiness_level] DS Mức độ sẵn sàng
│     URL: /Cat_ReadinessLevel/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_job_title_professional] DS Chức danh chuyên môn
│     URL: /Cat_JobTitleProfessional/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_headcount_org] DS Mã headcount cơ cấu
│     URL: /Cat_HeadcountOrg/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_emp_group_first_detail] DS Nhóm nhân viên chi tiết cấp 1
│     URL: /Cat_EmpGroupFirstDetail/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_emp_group_second_detail] DS Nhóm nhân viên chi tiết cấp 2
│     URL: /Cat_EmpGroupSecondDetail/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_head_count_sum] DS Mã headcount tổng hợp
│     URL: /Cat_HeadCountSum/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_service_outsource] DS Dịch vụ thuê ngoài
│     URL: /Cat_ServiceOutsource/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_party_cell_members] DS Chi bộ đảng viên
│     URL: /Cat_PartyCellMembers/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_shop_profile] Đơn vị kinh doanh
│     URL: /Cat_ShopProfile/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_shop_group] DS Loại đơn vị kinh doanh
│     URL: /Cat_ShopGroup/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_shop] DS Đơn vị kinh doanh
│     URL: /Cat_Shop/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
│  ═══════════════════════════════════════════════════════════════
│  NHÓM 5 — Nhân sự / Nghỉ việc / Hợp đồng
│  ═══════════════════════════════════════════════════════════════
│
├── [cat_reason_deny] DS Lý do từ chối
│     URL: /Cat_ReasonDeny/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_type_of_stop] DS Loại nghỉ việc
│     URL: /Cat_TypeOfStop/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_resign_reason] DS Lý do nghỉ việc
│     URL: /Cat_ResignReason/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_leave_from] DS Hình thức nghỉ việc
│     URL: /Cat_LeaveFrom/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_work_list] DS Công việc thực hiện
│     URL: /Cat_WorkList/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_evaluation_result] DS Kết quả đánh giá
│     URL: /Cat_EvaluationResult/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_type_of_retirement] DS Loại nghỉ hưu
│     URL: /Cat_TypeOfRetirement/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_type_of_replace] DS Lý do thay thế
│     URL: /Cat_TypeOfReplace/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_type_of_rotation] DS Loại luân chuyển/phân nhiệm chi tiết
│     URL: /Cat_TypeOfRotation/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_promo_class_qualifi_period] Kỳ đề bạt/chuyển bậc
│     URL: /Cat_PromoClassQualifiPeriod/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_contract_type] DS Loại hợp đồng
│     URL: /Cat_ContractType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG — fields: Tên*, Mã*, Số tháng, Tự động gia hạn (checkbox)]
│
├── [cat_next_contract_type] DS Quy tắc sinh loại HĐ kế tiếp
│     URL: /Cat_NextContractType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_appendix_contract_type] DS Nội dung thay đổi
│     URL: /Cat_AppendixContractType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_contract_template] DS Mẫu hợp đồng
│     URL: /Cat_ContractTemplate/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_contract_terms] DS Điều khoản hợp đồng
│     URL: /Cat_ContractTerms/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_adjustment_information] DS Thông tin điều chỉnh thay đổi
│     URL: /Cat_AdjustmentInformation/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_employee_group] DS Nhóm nhân viên
│     URL: /Cat_EmployeeGroup/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_employee_type] DS Loại nhân viên
│     URL: /Cat_EmployeeType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_relative_type] DS Loại quan hệ
│     URL: /Cat_RelativeType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_email_group] DS Nhóm email
│     URL: /Cat_EmailGroup/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_injury_factor] DS Yếu tố gây chấn thương
│     URL: /Cat_InjuryFactor/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_type_of_accident] DS Loại nguyên nhân tai nạn
│     URL: /Cat_TypeOfAccident/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_cause_of_accident] DS Nguyên nhân tai nạn
│     URL: /Cat_CauseOfAccident/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_accident_type] DS Loại tai nạn
│     URL: /Cat_AccidentType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_council_section] DS Tổ, hội đồng
│     URL: /Cat_CouncilSection/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_functional_of_dept_pos] DS Chức năng nhiệm vụ
│     URL: /Cat_FunctionalOfDeptPos/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_papers_type] DS Loại giấy tờ
│     URL: /Cat_PapersType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_delegate_company] DS Người đăng ký ủy quyền
│     URL: /Cat_DelegateCompany/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_delegation_reason] DS Căn cứ ủy quyền
│     URL: /Cat_DelegationReason/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_kpilevel] DS Cấp bậc tiêu chí
│     URL: /Cat_KPILevel/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_group_job] DS Nhóm công việc
│     URL: /Cat_GroupJob/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_welfare] DS Loại phúc lợi
│     URL: /Cat_Welfare/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_req_document] DS Hồ sơ yêu cầu
│     URL: /Cat_ReqDocument/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_doc_assessment_result] DS Kết quả đánh giá hồ sơ
│     URL: /Cat_DocAssessmentResult/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_eva_document_template] DS Mẫu hồ sơ đánh giá
│     URL: /Cat_EvaDocumentTemplate/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_rating_scales] DS Cấp bậc tiêu chí
│     URL: /Cat_RatingScales/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_vehicle] DS Phương tiện đi làm
│     URL: /Cat_Vehicle/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_unions_company] DS Đoàn thể công ty
│     URL: /Cat_UnionsCompany/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_cost_source] DS Nguồn chi phí
│     URL: /Cat_CostSource/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_element_report_headcount] DS Loại BC headcount
│     URL: /Cat_ElementReportHeadcount/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_card_type] DS Loại thẻ đeo
│     URL: /Cat_CardType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_activation_area] DS Khu vực kích hoạt thẻ đeo
│     URL: /Cat_ActivationArea/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_special_area] Khu vực hạn chế
│     URL: /Cat_SpecialArea/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_proposal_evaluate_profile] Đề xuất đánh giá hồ sơ
│     URL: /Cat_ProposalEvaluateProfile/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_hre_data_config] Thiết lập điều kiện dữ liệu nhân sự
│     URL: /Cat_HreDataConfig/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_digital_signature_code] DS Mã quy trình chữ ký số
│     URL: /Cat_DigitalSignatureCode/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_phone_number_changes] DS Đổi đầu số điện thoại
│     URL: /Cat_PhoneNumberChanges/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_budget_profes_development] DS Ngân sách khuyến học
│     URL: /Cat_BudgetProfesDevelopment/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_logistics_assistance_for_pd] DS Hỗ trợ hậu cần khuyến học
│     URL: /Cat_LogisticsAssistanceForPD/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_planning_info_approval_levels] DS Cấp phê duyệt thông tin quy hoạch
│     URL: /Cat_PlanningInfoApprovalLevels/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
│  ═══════════════════════════════════════════════════════════════
│  NHÓM 6 — Trình độ / Học vấn / Kỹ năng
│  ═══════════════════════════════════════════════════════════════
│
├── [cat_list_qualification_level] DS Xếp loại bằng cấp
│     URL: /Cat_ListQualificationLevel/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_list_qualification] DS Bằng cấp
│     URL: /Cat_ListQualification/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_subject_group] DS Nhóm môn học
│     URL: /Cat_SubjectGroup/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_subject] DS Môn học
│     URL: /Cat_Subject/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_major] DS Ngành
│     URL: /Cat_Major/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_sub_major] DS Chuyên ngành
│     URL: /Cat_SubMajor/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_education_level] Trình độ học vấn
│     URL: /Cat_EducationLevel/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_graduated_level] Trình độ văn hóa
│     URL: /Cat_GraduatedLevel/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_qualification] Trình độ chuyên môn
│     URL: /Cat_Qualification/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_qualification_level] Cấp độ chuyên môn
│     URL: /Cat_QualificationLevel/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_computing_type] Trình độ tin học
│     URL: /Cat_ComputingType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_computing_level] DS Cấp độ tin học
│     URL: /Cat_ComputingLevel/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_computing_skill] DS Kỹ năng tin học
│     URL: /Cat_ComputingSkill/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_language_type] Trình độ ngôn ngữ
│     URL: /Cat_LanguageType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_language_skill] DS Kỹ năng ngôn ngữ
│     URL: /Cat_LanguageSkill/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_language_level] DS Cấp bậc ngoại ngữ
│     URL: /Cat_LanguageLevel/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_training_place] DS Nơi đào tạo
│     URL: /Cat_TrainingPlace/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
│  ═══════════════════════════════════════════════════════════════
│  NHÓM 7 — Chấm công / Ca làm việc / Ngày nghỉ
│  ═══════════════════════════════════════════════════════════════
│
├── [cat_leave_day_type] DS Loại ngày nghỉ
│     URL: /Cat_LeaveDayType/Index  |  Loại: List screen
│     │
│     ├── FEATURE: Danh sách
│     │     SCREEN: List screen
│     │       --[Tìm kiếm]--> lọc theo Loại ngày nghỉ, Mã, Mã TK, Vô hiệu
│     │       --[Xuất excel]--> tải file .xlsx
│     │
│     ├── FEATURE: Tạo mới
│     │     SCREEN: Navigate → /Cat_LeaveDayType/Create
│     │       Nhập (Thông tin chung):
│     │         Loại ngày nghỉ*, Mã*, Mã TK*, Ghi chú
│     │         Chưa chọn trong portal (checkbox), Chứng từ y tế (checkbox)
│     │         Không kiểm tra ca (checkbox)
│     │       Nhập (Các loại phép):
│     │         Loại nghỉ BHXH (checkbox), Là phép năm (checkbox), Nghỉ bù (checkbox)
│     │         Loại chứng từ cần nộp (combobox), Nghỉ tang gia (checkbox), Phép thâm niên (checkbox)
│     │       Nhập (Chi phí chi trả):
│     │         Công ty trả (number), BHXH trả (number)
│     │       Nhập (Giới hạn phép nghỉ):
│     │         Số ngày nghỉ tối đa/lần (number), Số ngày nghỉ tối đa/năm (text)
│     │         Số ngày nghỉ tối đa/tháng, Số ngày nghỉ tối đa/tuần, Số giờ nghỉ tối đa
│     │         Điều kiện được đăng ký (textbox)
│     │       Nhập (Thông tin khác):
│     │         Mã phụ thuộc, Công thức, Loại OT (combobox), Vô hiệu (checkbox)
│     │       --[Lưu]--> ✓ toast: "Lưu thành công" --> [cat_leave_day_type]
│     │       --[Lưu và tạo mới]--> ✓ lưu và reset form
│     │
│     ├── FEATURE: Chỉnh sửa
│     │     SCREEN: Navigate → /Cat_LeaveDayType/Edit/{id}
│     │       [Các field như Tạo mới, đã điền sẵn]
│     │       --[Lưu]--> ✓ toast: "Cập nhật thành công"
│     │
│     └── FEATURE: Xóa
│           SCREEN: (Confirm: Xác nhận xóa?)
│             --[Đồng ý]--> ✓ toast: "Xóa thành công"
│
├── [cat_grade_attendance] Chế độ công
│     URL: /Cat_GradeAttendance/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_element_attendance] Phần tử tính công
│     URL: /Cat_ElementAttendance/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_day_off] DS Ngày nghỉ lễ
│     URL: /Cat_DayOff/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG — fields: Ngày nghỉ*, Tên ngày nghỉ*, Loại ngày nghỉ (combobox)]
│
├── [cat_cut_off_duration_type] DS Loại kỳ công
│     URL: /Cat_CutOffDurationType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_shift] DS Loại ca làm việc
│     URL: /Cat_Shift/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG — dialog mở khi click Tạo mới]
│
├── [cat_roster_group_type] DS Loại nhóm ca
│     URL: /Cat_RosterGroupType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_overtime_type] DS Loại tăng ca
│     URL: /Cat_OvertimeType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_overtime_reason] DS Lý do tăng ca
│     URL: /Cat_OvertimeReason/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_overtime_reson] DS Lý do muộn sớm
│     URL: /Cat_OvertimeReson/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_tamscan_reason_miss_for_att] DS Lý do không quẹt thẻ
│     URL: /Cat_TAMScanReasonMissForAtt/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_tamscan_reason_miss] DS Lý do không quẹt thẻ
│     URL: /Cat_TAMScanReasonMiss/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_job_type] DS Loại công việc
│     URL: /Cat_JobType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_unit_price] DS Đơn giá công việc
│     URL: /Cat_UnitPrice/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_shift_detail] DS Tiết học
│     URL: /Cat_ShiftDetail/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_show_config_list_on_calendar] DS Cấu hình hiển thị dữ liệu công
│     URL: /Cat_ShowConfigListOnCalendar/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_travel_warrant] DS Nơi cấp giấy đi đường
│     URL: /Cat_TravelWarrant/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_att_data_config] Thiết lập điều kiện dữ liệu công
│     URL: /Cat_AttDataConfig/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_data_note] DS Ghi chú dữ liệu
│     URL: /Cat_DataNote/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_wifi] DS Wifi
│     URL: /Cat_Wifi/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG — fields: Tên Wifi*, Địa chỉ MAC*, Phòng ban (combobox)]
│
├── [cat_location_for_checking_gps] DS Tọa độ chấm công GPS
│     URL: /Cat_LocationForCheckingGPS/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG — fields: Tên*, Kinh độ*, Vĩ độ*, Bán kính (m)]
│
├── [cat_time_sheet_evaluation] DS Xếp loại đánh giá công việc hàng ngày
│     URL: /Cat_TimeSheetEvaluation/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_shop_tam] DS Máy chấm công cửa hàng
│     URL: /Cat_ShopTam/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_group_emp_work_schedule] DS Nhóm NV theo lịch làm việc
│     URL: /Cat_GroupEmpWorkSchedule/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_manage_leave] Quản lý quỹ phép theo điều kiện
│     URL: /Cat_ManageLeave/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_area_hdt] DS Khu vực nặng nhọc, độc hại
│     URL: /Cat_AreaHDT/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_attendance_item_report_config] Cấu hình hiển thị dữ liệu công
│     URL: /Cat_AttendanceItemReportConfig/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_location] DS Địa điểm xe đưa đón
│     URL: /Cat_Location/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
│  ═══════════════════════════════════════════════════════════════
│  NHÓM 8 — Công tác / Chi phí
│  ═══════════════════════════════════════════════════════════════
│
├── [cat_mission_cost_type] DS Loại chi phí
│     URL: /Cat_MissionCostType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_type_of_service] DS Loại dịch vụ
│     URL: /Cat_TypeOfService/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_mission_distance] DS Khoảng cách công tác
│     URL: /Cat_MissionDistance/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_ratio_mission] DS Định mức công tác phí
│     URL: /Cat_RatioMission/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_business_travel] DS Loại công tác
│     URL: /Cat_BusinessTravel/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_movement_types] DS Loại di chuyển
│     URL: /Cat_MovementTypes/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_business_trip_reason] DS Lý do đi công tác
│     URL: /Cat_BusinessTripReason/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_purpose_register_vehicle] DS Mục đích đăng ký phương tiện
│     URL: /Cat_PurposeRegisterVehicle/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_policy_costs] Chính sách cho từng khoản phí
│     URL: /Cat_PolicyCosts/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_policy_costs_profile] Chính sách cho từng khoản phí theo NV
│     URL: /Cat_PolicyCostsProfile/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_cost] DS Khoản mục phí
│     URL: /Cat_Cost/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
│  ═══════════════════════════════════════════════════════════════
│  NHÓM 9 — Lương / Phần tử / Chế độ lương
│  ═══════════════════════════════════════════════════════════════
│
├── [cat_element] Phần tử tính lương
│     URL: /Cat_Element/Index  |  Loại: List screen
│     │
│     ├── FEATURE: Danh sách
│     │     SCREEN: List screen
│     │       --[Tìm kiếm]--> lọc danh sách
│     │       --[Xuất enum dự án]--> xuất file
│     │       --[Cập nhật số thứ tự phần tử]--> cập nhật hàng loạt
│     │       --[Cập nhật lại các phần tử]--> refresh dữ liệu
│     │       --[Xuất excel]--> tải file .xlsx
│     │
│     ├── FEATURE: Tạo mới
│     │     SCREEN: (Dialog: Tạo mới phần tử)
│     │       Nhập: Tên phần tử*, Mã*, Nhóm phần tử (combobox), Loại phần tử (combobox)
│     │              Công thức (textbox), Ghi chú
│     │       --[Lưu]--> ✓ toast: "Lưu thành công"
│     │
│     └── FEATURE: Xóa
│           SCREEN: (Confirm)
│             --[Đồng ý]--> ✓ toast: "Xóa thành công"
│
├── [cat_element_group] DS Nhóm phần tử tính lương
│     URL: /Cat_ElementGroup/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_element_commission] Phần tử lương hoa hồng
│     URL: /Cat_ElementCommission/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_advance_payment] Phần tử ứng lương
│     URL: /Cat_AdvancePayment/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_element_bonus] Phần tử tính thưởng
│     URL: /Cat_ElementBonus/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_grade_sal_dept_element] Phần tử công thức lương bộ phận
│     URL: /Cat_GradeSalDeptElement/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_element_budget] Phần tử tính ngân sách
│     URL: /Cat_ElementBudget/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_salary_fund_element] Phần tử tính quỹ lương
│     URL: /Cat_SalaryFundElement/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_grade_payroll] Chế độ lương
│     URL: /Cat_GradePayroll/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_grade_sal_dept] Công thức lương bộ phận
│     URL: /Cat_GradeSalDept/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_currency] DS Tiền tệ
│     URL: /Cat_Currency/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG — fields: Tên tiền tệ*, Mã tiền tệ*, Ký hiệu]
│
├── [cat_exchange_rate] Tỷ giá ngoại tệ
│     URL: /Cat_ExchangeRate/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG — fields: Loại tiền (combobox)*, Ngày hiệu lực*, Tỷ giá*]
│
├── [cat_market_job_title] DS Vị trí công việc thị trường
│     URL: /Cat_MarketJobTitle/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_payroll_group] Nhóm lương
│     URL: /Cat_PayrollGroup/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_salary_class_type] Loại ngạch lương
│     URL: /Cat_SalaryClassType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_salary_class] Ngạch lương
│     URL: /Cat_SalaryClass/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_income_type] Loại thu nhập
│     URL: /Cat_IncomeType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_salary_rank] Bậc lương
│     URL: /Cat_SalaryRank/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_kpirank] Bậc P2
│     URL: /Cat_KPIRank/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_salary_rank_detail] Tiền bậc lương
│     URL: /Cat_SalaryRankDetail/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_seniority_rank] DS Thâm niên tăng bậc chi tiết
│     URL: /Cat_SeniorityRank/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_payroll_category] Bảng lương
│     URL: /Cat_PayrollCategory/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_salary_survey] Cơ cấu lương
│     URL: /Cat_SalarySurvey/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_reason_change_salary] Lý do thay đổi lương
│     URL: /Cat_ReasonChangeSalary/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_pay_raise_conditions] ĐK phân tích tăng lương
│     URL: /Cat_PayRaiseConditions/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_template_name] Mẫu so sánh lương
│     URL: /Cat_TemplateName/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_element_config] Công cụ cấu hình phần tử lương
│     URL: /Cat_ElementConfig/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_sal_advance_condition] Thiết lập điều kiện ứng lương
│     URL: /Cat_SalAdvanceCondition/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_over_offset_formula] DS Công thức
│     URL: /Cat_OverOffsetFormula/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_budget_parameter] DS Tham số tính ngân sách
│     URL: /Cat_BudgetParameter/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_cost_centre] Mã chi phí
│     URL: /Cat_CostCentre/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_cost_centre_group] Nhóm mã chi phí
│     URL: /Cat_CostCentreGroup/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_company_cost_group] Nhóm chi phí công ty
│     URL: /Cat_CompanyCostGroup/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_cost_centre_distribution] Phân bổ theo mã chi phí
│     URL: /Cat_CostCentreDistribution/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_cost_activity] Hạng mục chi phí
│     URL: /Cat_CostActivity/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_element_mapto_account] Định khoản phần tử lương
│     URL: /Cat_ElementMaptoAccount/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_account_type] Loại tài khoản
│     URL: /Cat_AccountType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_unusual_allowance_cfg] Phụ cấp
│     URL: /Cat_UnusualAllowanceCfg/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_usual_allowance] Phụ cấp theo chế độ
│     URL: /Cat_UsualAllowance/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_usual_allowance_group] Nhóm phụ cấp
│     URL: /Cat_UsualAllowanceGroup/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_un_allow_cfg_amount] Mức thưởng phụ cấp
│     URL: /Cat_UnAllowCfgAmount/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_allowance_cfg_area_post_job_work] Phụ lục mức thưởng phụ cấp
│     URL: /Cat_AllowanceCfgAreaPostJobWork/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_payment_costs_groups] DS Nhóm thanh toán chi phí
│     URL: /Cat_PaymentCostsGroups/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_payment_amount] Khoản thanh toán chi phí
│     URL: /Cat_PaymentAmount/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_fund] Ngân sách
│     URL: /Cat_Fund/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_budget_type] Loại ngân sách
│     URL: /Cat_BudgetType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_budget_code] Mã ngân sách
│     URL: /Cat_BudgetCode/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_expenses_by_budget_code] Chi phí theo mã ngân sách
│     URL: /Cat_ExpensesByBudgetCode/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_level_agency] DS Cấp môi giới
│     URL: /Cat_LevelAgency/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_average_salary] DS Mức lương bình quân
│     URL: /Cat_AverageSalary/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_salary_check] Thông tin kiểm tra lương
│     URL: /Cat_SalaryCheck/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_reward_period] Kỳ thưởng
│     URL: /Cat_RewardPeriod/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_parameter] DS Tham số
│     URL: /Cat_Parameter/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_pitformula] Chế độ thuế
│     URL: /Cat_PITFormula/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_shift_price] DS Đơn giá ca làm việc
│     URL: /Cat_shiftPrice/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_accrued_expense_type] DS Loại công phát sinh
│     URL: /Cat_AccruedExpenseType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_salary_fund_type] DS Loại quỹ lương
│     URL: /Cat_SalaryFundType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_voluntary_ins_type] Loại bảo hiểm tự nguyện
│     URL: /Cat_VoluntaryInsType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_company_rate] Hệ số công ty
│     URL: /Cat_CompanyRate/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_bonus_type] DS Loại thưởng
│     URL: /Cat_BonusType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
│  ═══════════════════════════════════════════════════════════════
│  NHÓM 10 — Sản phẩm / Kinh doanh
│  ═══════════════════════════════════════════════════════════════
│
├── [cat_product_type] Loại sản phẩm
│     URL: /Cat_ProductType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_product] Sản phẩm
│     URL: /Cat_Product/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_product_item] Chi tiết SP
│     URL: /Cat_ProductItem/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_product_item_price] Chi tiết SP theo timeline
│     URL: /Cat_ProductItemPrice/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_product_part] DS Công đoạn thành phẩm
│     URL: /Cat_ProductPart/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_price_type] Loại đơn giá
│     URL: /Cat_PriceType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_price_type_detail] Giá trị loại đơn giá
│     URL: /Cat_PriceTypeDetail/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_kpibonus] Tiêu chí thưởng
│     URL: /Cat_KPIBonus/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_kpibonus_item] Tỷ lệ tiêu chí thưởng
│     URL: /Cat_KPIBonusItem/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_brand] Thương hiệu
│     URL: /Cat_Brand/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_unit] Đơn vị tính
│     URL: /Cat_Unit/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_fabric] DS Loại vải
│     URL: /Cat_Fabric/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_wash] DS Loại giặt
│     URL: /Cat_Wash/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_conveyor] DS Loại thiết lập phòng ban
│     URL: /Cat_Conveyor/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_product_task_type] DS Loại công việc SP
│     URL: /Cat_ProductTaskType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_line_item] Dòng sản phẩm
│     URL: /Cat_LineItem/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_item] DS Phiếu ăn
│     URL: /Cat_Item/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_exchange] DS Sàn
│     URL: /Cat_Exchange/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_apartment] Căn hộ
│     URL: /Cat_Apartment/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_construction_project] Dự án bất động sản
│     URL: /Cat_ConstructionProject/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_transaction_type] Loại giao dịch
│     URL: /Cat_TransactionType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_purchase_items] DS Sản phẩm
│     URL: /Cat_PurchaseItems/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_budget] Nguồn chi
│     URL: /Cat_Budget/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
│  ═══════════════════════════════════════════════════════════════
│  NHÓM 11 — ESOP / Bảo hiểm
│  ═══════════════════════════════════════════════════════════════
│
├── [cat_esopformula] DS Công thức hưởng quyền ESOP
│     URL: /Cat_ESOPFormula/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_esoptype] DS Loại ESOP
│     URL: /Cat_ESOPType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_funding_round] DS Vòng gọi vốn
│     URL: /Cat_FundingRound/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_entitlement_type] DS Loại hưởng quyền
│     URL: /Cat_EntitlementType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_esopprogram] DS Chương trình ESOP
│     URL: /Cat_ESOPProgram/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_insurance_grade] Chế độ bảo hiểm
│     URL: /Cat_InsuranceGrade/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_insurance_element] Phần tử tính bảo hiểm
│     URL: /Cat_InsuranceElement/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_health_treatment_place] Nơi khám chữa bệnh
│     URL: /Cat_HealthTreatmentPlace/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_voluntary_ins_company] Công ty bảo hiểm
│     URL: /Cat_VoluntaryInsCompany/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_insurance_type] Loại bảo hiểm
│     URL: /Cat_InsuranceType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_insurance_record_type] Loại chứng từ
│     URL: /Cat_InsuranceRecordType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_insurance_sick] DS Bệnh
│     URL: /Cat_InsuranceSick/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_treatment_line] DS Tuyến điều trị
│     URL: /Cat_TreatmentLine/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_social_ins_form] DS Hồ sơ bảo hiểm
│     URL: /Cat_SocialInsForm/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_insurance_indicator] Chỉ tiêu kiểm tra dữ liệu
│     URL: /Cat_InsuranceIndicator/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
│  ═══════════════════════════════════════════════════════════════
│  NHÓM 12 — Đánh giá / KPI
│  ═══════════════════════════════════════════════════════════════
│
├── [cat_performance_type] DS Loại đánh giá
│     URL: /Cat_PerformanceType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_criteria_group_type] DS Loại nhóm tiêu chí
│     URL: /Cat_CriteriaGroupType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_kpigroup] DS Nhóm tiêu chí
│     URL: /Cat_KPIGroup/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_evaluation_formula] DS Công thức
│     URL: /Cat_EvaluationFormula/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_time_evalution_data] DS Lần tổng hợp đánh giá
│     URL: /Cat_TimeEvalutionData/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_rules_evaluation_order] Quy tắc thứ tự cấp đánh giá
│     URL: /Cat_RulesEvaluationOrder/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_9box_category] DS Hạng mục 9-Box
│     URL: /Cat_9BoxCategory/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_9box] DS Hộp 9-Box
│     URL: /Cat_9Box/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_kpifunction] DS Chức năng KPI
│     URL: /Cat_KPIFunction/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_kpitype] DS Loại tiêu chí
│     URL: /Cat_KPIType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_scale] DS Thang đo
│     URL: /Cat_Scale/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
│  ═══════════════════════════════════════════════════════════════
│  NHÓM 13 — Đào tạo / Năng lực / Tài năng
│  ═══════════════════════════════════════════════════════════════
│
├── [cat_train_category] DS Loại đào tạo
│     URL: /Cat_TrainCategory/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_purpose_training] Mục đích đào tạo
│     URL: /Cat_PurposeTraining/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_method_training] Phương pháp đào tạo
│     URL: /Cat_MethodTraining/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_cost_type] Chi phí đào tạo
│     URL: /Cat_CostType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_document] DS Tài liệu
│     URL: /Cat_Document/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_level_competency] DS Cấp độ năng lực
│     URL: /Cat_LevelCompetency/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_topic] DS Chủ đề
│     URL: /Cat_Topic/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_reason_for_absent] DS Lý do vắng
│     URL: /Cat_ReasonForAbsent/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_train_level] DS Cấp độ
│     URL: /Cat_TrainLevel/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_certificate_issuance_unit] DS Đơn vị cấp chứng chỉ
│     URL: /Cat_CertificateIssuanceUnit/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_ranking_group] DS Thang đánh giá
│     URL: /Cat_RankingGroup/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_course_objective] DS Mục tiêu khóa học
│     URL: /Cat_CourseObjective/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_training_location] DS Địa điểm đào tạo
│     URL: /Cat_TrainingLocation/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_skill_course_certificate] Phụ lục năng lực
│     URL: /Cat_SkillCourseCertificate/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_course_type] DS Loại khóa học
│     URL: /Cat_CourseType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_training_formula] DS Công thức
│     URL: /Cat_TrainingFormula/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_criteria_group] DS Nhóm tiêu chí vị trí chủ chốt
│     URL: /Cat_CriteriaGroup/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_easy_to_fill_level] DS Mức độ dễ bổ sung
│     URL: /Cat_EasyToFillLevel/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_critical_level] DS Mức độ quan trọng
│     URL: /Cat_CriticalLevel/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_overall_level] DS Mức độ tổng quát
│     URL: /Cat_OverallLevel/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_key_position_formula] DS Công thức vị trí chủ chốt
│     URL: /Cat_KeyPositionFormula/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_competence_group] DS Nhóm năng lực
│     URL: /Cat_CompetenceGroup/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_skill] DS Năng lực
│     URL: /Cat_Skill/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_group_level_competency] DS Nhóm cấp độ năng lực
│     URL: /Cat_GroupLevelCompetency/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_competency_layer] DS Tầng năng lực
│     URL: /Cat_CompetencyLayer/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_behavior] DS Hành vi
│     URL: /Cat_Behavior/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_competency_type] DS Loại năng lực
│     URL: /Cat_CompetencyType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_competence_group_tree_view] Thư viện năng lực
│     URL: /Cat_CompetenceGroupTreeView/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_competency_framework] DS Khung năng lực
│     URL: /Cat_CompetencyFramework/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_talent_formula] DS Công thức
│     URL: /Cat_TalentFormula/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
│  ═══════════════════════════════════════════════════════════════
│  NHÓM 14 — Địa lý / Ngân hàng / Xã hội
│  ═══════════════════════════════════════════════════════════════
│
├── [cat_region] DS Khu vực/vùng miền
│     URL: /Cat_Region/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_country] DS Quốc gia
│     URL: /Cat_Country/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_province] DS Tỉnh/thành phố
│     URL: /Cat_Province/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_district] DS Quận/huyện
│     URL: /Cat_District/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_village] DS Phường/xã
│     URL: /Cat_Village/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_idcard_issue_place] DS Nơi cấp CCCD
│     URL: /Cat_IDCardIssuePlace/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_passport_issue_place] DS Nơi cấp hộ chiếu
│     URL: /Cat_PassportIssuePlace/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_religion] DS Tôn giáo
│     URL: /Cat_Religion/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_nationality_group] Nhóm quốc tịch
│     URL: /Cat_NationalityGroup/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_dormitory] Ký túc xá
│     URL: /Cat_Dormitory/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_place_of_issue_tax] DS Nơi cấp mã số thuế
│     URL: /Cat_PlaceOfIssueTax/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_ethnic_group] Dân tộc
│     URL: /Cat_EthnicGroup/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_youth_union_position] DS Chức vụ đoàn
│     URL: /Cat_YouthUnionPosition/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_communist_party_position] DS Chức vụ đảng
│     URL: /Cat_CommunistPartyPosition/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_wounded_soldier_types] DS Loại thương binh
│     URL: /Cat_WoundedSoldierTypes/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_political_level] DS Trình độ chính trị
│     URL: /Cat_PoliticalLevel/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_armed_force_types] DS Hội đồng quản trị
│     URL: /Cat_ArmedForceTypes/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_trade_unionist_position] DS Chức vụ đoàn viên công đoàn
│     URL: /Cat_TradeUnionistPosition/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_self_defence_militia_position] DS Chức vụ dân quân tự vệ
│     URL: /Cat_SelfDefenceMilitiaPosition/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_veteran_union_position] DS Chức vụ hội cựu chiến binh
│     URL: /Cat_VeteranUnionPosition/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_soldier_position] DS Chức vụ bộ đội
│     URL: /Cat_SoldierPosition/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_rank_army] DS Quân hàm bộ đội
│     URL: /Cat_RankArmy/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_union_position] DS Chức vụ công đoàn
│     URL: /Cat_UnionPosition/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_bank] Ngân hàng
│     URL: /Cat_Bank/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG — fields: Tên ngân hàng*, Mã ngân hàng*, Mã SWIFT]
│
├── [cat_bank_excel_grid] Ngân hàng (Excel Grid)
│     URL: /Cat_BankExcelGrid/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_branch] Chi nhánh ngân hàng
│     URL: /Cat_Branch/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG — fields: Tên chi nhánh*, Ngân hàng (combobox)*]
│
├── [cat_account_company] DS Tài khoản chi trả
│     URL: /Cat_AccountCompany/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
│  ═══════════════════════════════════════════════════════════════
│  NHÓM 15 — Khảo sát / Truyền thông / Hệ thống
│  ═══════════════════════════════════════════════════════════════
│
├── [cat_survey] Bảng khảo sát
│     URL: /Cat_Survey/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_survey_question_type] Loại câu hỏi
│     URL: /Cat_SurveyQuestionType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_survey_question_group] DS Nhóm câu hỏi
│     URL: /Cat_SurveyQuestionGroup/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_priority] Độ ưu tiên
│     URL: /Cat_Priority/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_room] Phòng họp
│     URL: /Cat_Room/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_news_type] DS Loại tin tức
│     URL: /Cat_NewsType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_news] DS Tin tức
│     URL: /Cat_News/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_manage_news] Quản lý tin tức mới
│     URL: /Cat_ManageNews/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_notification_type] DS Loại thông báo
│     URL: /Cat_NotificationType/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_data_group] Nhóm dữ liệu
│     URL: /Cat_DataGroup/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_automatic_permission_assignment] Cấu hình phân quyền tự động
│     URL: /Cat_AutomaticPermissionAssignment/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_approved_grade] Chế độ duyệt
│     URL: /Cat_ApprovedGrade/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_attachment_download] Tải tập tin đính kèm
│     URL: /Cat_AttachmentDownload/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_label] DS Nhãn
│     URL: /Cat_Label/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_master_data_group] Dự án
│     URL: /Cat_MasterDataGroup/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_project] Dự án
│     URL: /Cat_Project/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_sync] Cấu hình đồng bộ dữ liệu
│     URL: /Cat_Sync/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_conditional_color] Thiết lập hiển thị màu sắc
│     URL: /Cat_ConditionalColor/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_enum_translate] DS Cấu hình dịch enum
│     URL: /Cat_EnumTranslate/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_table_translate] DS Cấu hình dịch danh mục
│     URL: /Cat_TableTranslate/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_attachment_download_configuration] Cấu hình tải tập tin đính kèm
│     URL: /Cat_AttachmentDownloadConfiguration/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
│  ═══════════════════════════════════════════════════════════════
│  NHÓM 16 — Import / Export / Pivot (màn hình đặc biệt)
│  ═══════════════════════════════════════════════════════════════
│
├── [cat_import_import] Nhập dữ liệu (Import List)
│     URL: /Cat_Import/Import_List  |  Loại: Import screen
│     │
│     ├── FEATURE: Nhập dữ liệu
│     │     SCREEN: Import screen
│     │       --[Tải file mẫu]--> download template Excel
│     │       --[Chọn file]--> upload file .xlsx/.xls
│     │       --[Nhập dữ liệu]--> validate và import
│     │       --[Xem lỗi]--> hiển thị dòng lỗi
│     │
│     └── [TODO: kiểm tra thủ công các bước import]
│
├── [cat_import] Nhập dữ liệu
│     URL: /Cat_Import/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG — cấu hình import]
│
├── [cat_import_att] Nhập liệu chấm công
│     URL: /Cat_ImportAtt/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_import_ot] Cấu hình nhập dữ liệu tăng ca
│     URL: /Cat_ImportOT/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_import_mercer] Cấu hình nhập dữ liệu lương thị trường
│     URL: /Cat_ImportMercer/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_export] Xuất dữ liệu
│     URL: /Cat_Export/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG — cấu hình export]
│
├── [cat_export_word] Xuất word
│     URL: /Cat_ExportWord/Index  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
├── [cat_pivot_pivot_list] Tách dữ liệu (Pivot List)
│     URL: /Cat_Pivot/Pivot_List  |  Loại: List screen
│     [Áp dụng PATTERN CHUNG]
│
└── [cat_pivot] Tách dữ liệu
      URL: /Cat_Pivot/Index  |  Loại: List screen
      [Áp dụng PATTERN CHUNG — cấu hình pivot]
```

---

## Chi tiết màn hình tiêu biểu

### [cat_leave_day_type] — DS Loại ngày nghỉ

> URL: `https://pehn02.vnresource.net:4406/#/Hrm_Main_Web/Cat_LeaveDayType/Index`
> Loại: List screen → Create/Edit navigate sang trang riêng
> Feature: Danh mục chấm công
> Trạng thái crawl: ✅ Thành công
> Thời gian: 2026-06-11 11:20:00

#### Toolbar Actions

| Action | Loại | Trạng thái | Kết quả |
| --- | --- | --- | --- |
| Tạo mới | navigate | enabled | Navigate → /Cat_LeaveDayType/Create |
| Tìm kiếm | filter | enabled | Lọc theo Loại ngày nghỉ, Mã, Mã TK, Vô hiệu |
| Xuất excel | export | enabled | Tải file .xlsx |
| Đổi cột | column-config | enabled | Ẩn/hiện cột |
| Xóa | delete | disabled | Khi chưa chọn record |

#### Feature: Tạo mới

**Screen**: Navigate → /Cat_LeaveDayType/Create

Happy Path:
1. Navigate đến `[cat_leave_day_type]` → danh sách
2. Click **Tạo mới** → navigate sang trang Create
3. Điền tab **Thông tin chung**: Loại ngày nghỉ (bắt buộc), Mã (bắt buộc), Mã TK (bắt buộc), Ghi chú
4. Chọn **Các loại phép**: Loại nghỉ BHXH, Là phép năm, Nghỉ bù, Nghỉ tang gia, Phép thâm niên
5. Điền **Chi phí chi trả**: Công ty trả (%), BHXH trả (%)
6. Điền **Giới hạn phép nghỉ**: Số ngày tối đa/lần, năm, tháng, tuần
7. Click **Lưu**
8. Kết quả: toast `"Lưu thành công"` → redirect về danh sách

Form Fields:

| Field | Loại | Bắt buộc | BasePage Method |
| --- | --- | --- | --- |
| Loại ngày nghỉ | textbox | ✓ | `inputTextbox` |
| Mã | textbox | ✓ | `inputTextbox` |
| Mã TK | textbox | ✓ | `inputTextbox` |
| Ghi chú | textbox | — | `inputTextbox` |
| Là phép năm | checkbox | — | `inputCheckbox` |
| Loại nghỉ BHXH | checkbox | — | `inputCheckbox` |
| Nghỉ bù | checkbox | — | `inputCheckbox` |
| Nghỉ tang gia | checkbox | — | `inputCheckbox` |
| Phép thâm niên | checkbox | — | `inputCheckbox` |
| Loại chứng từ cần nộp | combobox | — | `inputCombobox` |
| Công ty trả | number | — | `inputTextbox` |
| BHXH trả | number | — | `inputTextbox` |
| Số ngày nghỉ tối đa/lần | number | — | `inputTextbox` |
| Số ngày nghỉ tối đa/năm | textbox | — | `inputTextbox` |
| Số ngày nghỉ tối đa/tháng | textbox | — | `inputTextbox` |
| Điều kiện được đăng ký | textbox | — | `inputTextbox` |
| Loại OT | combobox | — | `inputCombobox` |
| Vô hiệu | checkbox | — | `inputCheckbox` |

---

### [cat_org_structure] — DS Phòng ban

> URL: `https://pehn02.vnresource.net:4406/#/Hrm_Main_Web/Cat_OrgStructure/Index`
> Loại: List screen
> Feature: Danh mục tổ chức
> Trạng thái crawl: ✅ Thành công

#### Toolbar Actions (mở rộng)

| Action | Loại | Trạng thái | Kết quả |
| --- | --- | --- | --- |
| Tạo mới | open-dialog/navigate | enabled | Tạo phòng ban mới |
| Tìm kiếm | filter | enabled | Lọc theo Phòng ban, Mã, Công ty, Loại phòng ban, Phòng ban cha |
| Mở lại phòng ban | action | enabled | Khôi phục phòng ban vô hiệu |
| Điều chỉnh cấu trúc phòng ban | action | enabled | Kéo thả cơ cấu |
| Xuất excel | export | enabled | Tải .xlsx |
| Tạo mẫu | template | enabled | Download template |
| Đổi cột | column-config | enabled | — |
| Xóa | delete | disabled | Khi chưa chọn |

Form Fields (Tạo mới phòng ban):

| Field | Loại | Bắt buộc | BasePage Method |
| --- | --- | --- | --- |
| Phòng ban | textbox | ✓ | `inputTextbox` |
| Mã phòng ban | textbox | ✓ | `inputTextbox` |
| Công ty | combobox | ✓ | `inputCombobox` |
| Loại phòng ban | combobox | — | `inputCombobox` |
| Phòng ban cha | treeview/textbox | — | `inputTextbox` |
| Nơi làm việc | combobox | — | `inputCombobox` |
| Trưởng phòng ban | combobox | — | `inputCombobox` |
| Vô hiệu | checkbox | — | `inputCheckbox` |

---

### [cat_element] — Phần tử tính lương

> URL: `https://pehn02.vnresource.net:4406/#/Hrm_Main_Web/Cat_Element/Index`
> Loại: List screen
> Feature: Danh mục lương
> Trạng thái crawl: ✅ Thành công

#### Toolbar Actions (đặc biệt)

| Action | Loại | Trạng thái | Kết quả |
| --- | --- | --- | --- |
| Tạo mới | open-dialog | enabled | Mở dialog tạo phần tử |
| Tìm kiếm | filter | enabled | Lọc danh sách |
| Xuất enum dự án | export | enabled | Export enum |
| Cập nhật số thứ tự phần tử | action | enabled | Batch update thứ tự |
| Cập nhật lại các phần tử | action | enabled | Refresh cache phần tử |
| Xuất excel | export | enabled | Tải .xlsx |
| Đổi cột | column-config | enabled | — |
| Xóa | delete | disabled | Khi chưa chọn |

---

## Pattern tổng quát cho tất cả màn hình CAT List

> Áp dụng cho **~360/365** aliases trong nhóm CAT

### Toolbar chuẩn
| Button | Loại | Mô tả |
| --- | --- | --- |
| Tạo mới | create | Mở dialog inline hoặc navigate sang /Create |
| Tìm kiếm | filter | Lọc theo các field tìm kiếm phía trên grid |
| Xuất excel | export | Tải toàn bộ hoặc đã chọn ra .xlsx |
| Đổi cột | column-config | Ẩn/hiện cột trong grid |
| Xóa | delete | Xóa record đã chọn (disabled khi chưa chọn) |

### Happy Path tạo mới
1. Navigate → URL của alias
2. Click **Tạo mới** → dialog mở (hoặc navigate sang /Create)
3. Nhập các field bắt buộc (thường gồm: Tên*, Mã*)
4. Click **Lưu** / **Lưu và đóng**
5. Toast: `"Lưu thành công"` → record xuất hiện trong danh sách

### Happy Path chỉnh sửa
1. Navigate → danh sách
2. Click vào record để chọn (hoặc click icon edit)
3. Dialog mở / navigate sang /Edit — form điền sẵn dữ liệu
4. Thay đổi field cần sửa
5. Click **Lưu** / **Lưu và đóng**
6. Toast: `"Cập nhật thành công"`

### Happy Path xóa
1. Navigate → danh sách
2. Click checkbox chọn 1+ record
3. Click **Xóa** → dialog confirm xuất hiện
4. Click **Đồng ý**
5. Toast: `"Xóa thành công"` → record biến khỏi danh sách

### Field cơ bản (áp dụng cho hầu hết màn hình danh mục đơn giản)

| Field | Loại | Bắt buộc | BasePage Method |
| --- | --- | --- | --- |
| Tên / Tên danh mục | textbox | ✓ | `inputTextbox` |
| Mã | textbox | ✓ | `inputTextbox` |
| Ghi chú / Mô tả | textbox | — | `inputTextbox` |
| Vô hiệu | checkbox | — | `inputCheckbox` |
